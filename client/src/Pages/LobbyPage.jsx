import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import generateRandomRoomName from '../helpers/roomKeyGenarator';
import { getSocket } from '../helpers/socketHelper';


const LobbyPage = () => {
    // grabbing the lobbyId from url of Home.jsx Page to use on this page.
    const socket = getSocket();
    const location = useLocation();
    const { lobbyId, gameType } = useParams();

    const [gamePicked, setGamePicked] = useState('');
    const [coursePicked, setCoursePicked] = useState('');
    const [course, setCourse] = useState([]);
    const [setLoaded] = useState(false);
    const [games, setGames] = useState([]);
    const [players, setPlayers] = useState([]);
    const [creator, setCreator] = useState('');
    const [user, setUser] = useState(null);
    const [bettingAmount, setBettingAmount] = useState(0); // State for how much money betting.
    const navigate = useNavigate()
    const [teams, setTeams] = useState([]);
    const [teamValue, setTeamValue] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [roomKey, setRoomKey] = useState('');
    const [isCreator, setIsCreator] = useState(false);

    useEffect(() => {
        if (socket) {
            socket.emit('joinLobby', lobbyId);

            socket.on('joinSuccess', (response) => {
                console.log(response);
                localStorage.setItem('players', JSON.stringify(response.players.players));
                const userId = JSON.parse(localStorage.getItem('user_id'));
                if (userId === response.players.creatorId) {
                    setIsCreator(true)
                    localStorage.setItem('creator', true);
                } else {
                    localStorage.setItem('creator', false);
                }
                setCreator(response.players.creatorId);
                setPlayers(response.players.players);
            });

            socket.on('proceedToGameReceived', (data, teamsData) => {
                if (data.status) {
                    // Save lobbyId temporarily in local storage
                    localStorage.setItem('lobby', lobbyId);
                    if (teamsData.length > 0) {
                        localStorage.setItem('teams', JSON.stringify(teamsData));
                    }
                    navigate(`/new/game/${teamsData.length > 0 ? 'team' : 'individual'}`);
                } else {
                    alert(data.message);
                }
            });

            socket.on('setBettingAmountReceived', (data) => {
                localStorage.setItem('bettingAmount', data);
            });

            socket.on('addPlayerInTeamPlayReceived', (data) => {
                setTeams(data);
            });
        }
    }, [socket])

    // GET ALL GAMES
    useEffect(() => {
        axios.get('http://localhost:8000/api/games')
            .then((res) => {
                setGames(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching games: ${err}`);
            });
    }, []);

    // Grabbing user that is logged in and using data in local Storage
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (lobbyId)
            axios
                .get(`http://localhost:8000/api/lobbys/get-users-in-room/${lobbyId}`)
                .then((res) => console.log(res.data))
                .catch((error) => console.log(error));
    }, []);





    const handleJoinRoom = async (lobbyId) => {
        socket.emit('JoinRoom', { lobbyId })
        const inputLobbyId = document.getElementById('lobbyIdInput').value;

    }






    //CHANGES MADE HERE
    //=====================================================================================================


    const handleBettingAmount = () => {
        // Store the betting amount in local storage
        socket.emit('setBettingAmount', JSON.stringify(bettingAmount));
        //localStorage.setItem('bettingAmount', JSON.stringify(bettingAmount));
        // Debugging: Immediately retrieve and log the value
    }





    //=====================================================================================================
    // GET ALL COURSES
    useEffect(() => {
        axios.get('http://localhost:8000/api/courses')
            .then((res) => {
                setCourse(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching games: ${err}`);
            });
    }, []);





    // Function to handle game selection
    const handleGameSelection = (game) => {
        // console.log(game)
        setGamePicked(game);
    };


    // Function to handle course selection
    const handleCourseSelection = (course) => {
        // console.log(course)
        setCoursePicked(course);

    };


    // const handlePlayerChange = (index, value) => {
    //     // console.log(user, 'from within hamndle player change func')
    //     // players[0] = user.username;// 
    //     const updatedPlayers = [...players];
    //     updatedPlayers[index] = value;
    //     // console.log(updatedPlayers)
    //     setPlayers(updatedPlayers);
    // }

    const handleCreateTeam = () => {
        if (teams.length === 2) {
            alert('You cannot create a new team');
            return;
        }

        setTeams([...teams, { teamName: teamValue, players: [] }]);
        setTeamValue('');
        return;
    }

    const addPlayerToTeam = () => {
        if (selectedPlayer === 'Nil' || selectedTeam === 'Nil') {
            alert('Kindly select a team and a player to be able to add player to team.');
            return;
        }

        // Check if player already belongs to another team
        const isPlayerInAnyTeam = teams.some(team =>
            team.players.some(player => player.name === selectedPlayer)
        );

        if (isPlayerInAnyTeam) {
            alert('Player already belongs to a team');
            return;
        }

        // Extract full data of player
        const playerData = players.find(player => player.username === selectedPlayer);
        const updatedTeams = [...teams];

        // Find the specific team you want to update
        const teamToUpdate = updatedTeams.find(team => team.teamName === selectedTeam);
        teamToUpdate.players.push({
            id: playerData._id,
            name: playerData.username,
        });
        socket.emit('addPlayerInTeamPlay', updatedTeams);
    }

    const removeUserFromTeam = (id, teamName) => {
        const clonedTeams = [...teams];
        const teamToUpdate = clonedTeams.find(team => team.teamName === teamName);
        if (teamToUpdate) {
            teamToUpdate.players = teamToUpdate.players.filter(player => player.id !== id);
            socket.emit('addPlayerInTeamPlay', clonedTeams);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // store player data in storage
        localStorage.setItem('players', JSON.stringify(players));
        handleBettingAmount();
        const gamePayload = {
            players,
            amount: bettingAmount,
            lobby: lobbyId,
        }
        socket.emit('proceedToGame', gamePayload, teams);
    }


    return (
        <div className='container'>
            <div>
                <h1>Lobby Code: {lobbyId}</h1>

            </div>
            <div className="player-container">
                <p></p>

            </div>
            <div className="loadingPlayerContainer" >
                <h3>Players Loading...</h3>
                {
                    players.map((p, i) => {
                        return <h4 key={i} >{p.username}</h4>
                    })
                }
            </div>

            <div className='mt-5'>
                {
                    (isCreator && gameType === 'team') && <div>
                        <p>Note: Create two teams and add users to each team to be able to participate in the game</p>
                        <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                            <div className='row'>
                                <div className='col form-group'>
                                    <input className='form-control' placeholder='Enter team name' onChange={(e) => setTeamValue(e.target.value)} />
                                </div>
                                <div className='col-auto form-group'>
                                    <button className='btn btn-success' onClick={handleCreateTeam}>Create team</button>
                                </div>
                            </div>
                            <div className='row'>
                                <h5>Add Players to team</h5>
                                <div className='col form-group'>
                                    <select className='form-control' onChange={(e) => { setSelectedTeam(e.target.value) }}>
                                        <option value="Nil">Select team</option>
                                        {
                                            teams.map((team, index) => {
                                                return (
                                                    <option key={index + 1} value={team.teamName}>{team.teamName}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col form-group'>
                                    <select className='form-control' onChange={(e) => { setSelectedPlayer(e.target.value) }}>
                                        <option value="Nil">Select player</option>
                                        {
                                            players.map((player, index) => {
                                                return (
                                                    <option value={player.username} key={index + 1}>{player.username}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-auto form-group'>
                                    <button className='btn btn-info' onClick={addPlayerToTeam}>Add player to team</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className='row'>
                    {
                        teams.length > 0 ? teams.map((item, index) => {
                            return (
                                <div className='col-md-6' key={index + 1}>
                                    <h4>{item.teamName}</h4>
                                    {
                                        item.players && <ul>
                                            {
                                                item.players.map((data) => {
                                                    return (
                                                        <li key={data.id} className='mt-2'>
                                                            {data.name}
                                                            <button className='ml-2' onClick={() => removeUserFromTeam(data.id, item.teamName)}>x</button>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    }
                                </div>
                            )
                        }) : <p>No teams available...</p>
                    }
                </div>
            </div>
            <hr />
            <form className="mb-3 p-4" onSubmit={handleSubmit} style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                <label htmlFor="bettingAmount" className="form-label">Place Money to bet (18 Holes)</label>
                <input
                    type="number"
                    className="form-control"
                    name="bettingAmount"
                    placeholder='Enter amount'
                    disabled={!isCreator}
                    onChange={(e) => setBettingAmount(parseInt(e.target.value))}
                />
                <button type="submit" className="btn btn-primary mt-2" disabled={!isCreator} >Submit</button>

                <div>
                    {isCreator ? (
                        <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                            Home
                        </Link>
                    ) : (
                        <button className="btn btn-outline-primary btn-sm m-2" disabled>
                            Home
                        </button>
                    )}
                </div>
            </form>
        </div>




    );
};


export default LobbyPage;