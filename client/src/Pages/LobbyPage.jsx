import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import ScoreCard from '../Components/ScoreCard';
import generateRandomRoomName from '../helpers/roomKeyGenarator';
import { getSocket } from '../helpers/socketHelper';
import io from 'socket.io-client';


const LobbyPage = () => {
    // grabbing the lobbyId from url of Home.jsx Page to use on this page.
    const socket = getSocket();
    const location = useLocation();
    const { lobbyId, gameType } = useParams();

    // state for setting what game user picks
    const [gamePicked, setGamePicked] = useState('');
    // state for setting what course user picks
    const [coursePicked, setCoursePicked] = useState('');
    // state for loading in all of the db courses to choose from
    const [course, setCourse] = useState([]);
    const [setLoaded] = useState(false);
    // setting state for loading in all of the db games to choose from
    const [games, setGames] = useState([]);
    // state for setting user inputting players to play with.
    const [players, setPlayers] = useState([]);
    const [creator, setCreator] = useState('');

    const [user, setUser] = useState(null);
    const [bettingAmount, setBettingAmount] = useState(0); // State for how much money betting.
    const navigate = useNavigate()

    const [teams, setTeams] = useState([]);
    // const [teams, setTeams] = useState([
    //     {
    //       teamName: 'Team A',
    //       players: [
    //         {
    //           id: 'syfd636et27627w718w1',
    //           name: 'John Doe'
    //         },
    //         {
    //           id: 'bhfdjh7et27627w718w1',
    //           name: 'Alex Fidelis'
    //         }
    //       ]
    //     },
    //     {
    //       teamName: 'Team B',
    //       players: [
    //         {
    //           id: 'bnfd636et27627w718w1',
    //           name: 'Curator Bellis'
    //         },
    //         {
    //           id: 'bhfdjh7et27627wkj8w1',
    //           name: 'Davio Angel'
    //         }
    //       ]
    //     }
    // ]);
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
                    navigate('/new/game');
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
            </form>
            <div>
                <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                    Home
                </Link>
            </div>
        </div>




    );
};


export default LobbyPage;



/* <div>
<h1>Pick Your Game!</h1>
<div className="d-flex flex-wrap">
{games.map((game, i) => (
    <button
    key={i}
    type="button"
    className={`btn btn-outline-primary btn-sm m-2 btn-radio   ${gamePicked === game.name ? 'selected' : ''
}`}
onClick={() => handleGameSelection(game.name)}
style={{
                    backgroundColor: gamePicked === game.name ? 'blue' : '',
                }}
                >
                {game.name}
                </button>
                ))}
                </div>
                </div>
                
<div>
<h1>Choose Your Course!</h1>
<div className="d-flex flex-wrap">
{course.map((course, i) => (
    <button
    key={i}
    type="button"
    className={`btn btn-outline-primary btn-sm m-2 ${coursePicked === course.name ? 'selected' : ''
}`}
onClick={() => handleCourseSelection(course.name)}
style={{
    backgroundColor: coursePicked === course.name ? 'blue' : '',
}}
>
{course.name}
</button>
))}
</div>
</div> */
/* <div style={{ width: "500px", margin: "0 auto" }} >
    <h1>Add Players</h1>
    <form onSubmit={handleSubmit} >
        <div className="mb-3">
            <label htmlFor="player1" className="form-label">Player 1</label>

            <input type="text" className="form-control" id="player1" value={players[0]} onChange={(e) => handlePlayerChange(0, e.target.value)} />
        </div>

        <div className="mb-3">
            <label htmlFor="player2" className="form-label">Player 2</label>
            <input type="text" className="form-control" id="player2" value={players[1]} onChange={(e) => handlePlayerChange(1, e.target.value)} />
        </div>
        <div className="mb-3">
            <label htmlFor="player3" className="form-label">Player 3</label>
            <input type="text" className="form-control" id="player3" value={players[2]} onChange={(e) => handlePlayerChange(2, e.target.value)} />
        </div>
        <div className="mb-3">
            <label htmlFor="player4" className="form-label">Player 4</label>
            <input type="text" className="form-control" id="player4" value={players[3]} onChange={(e) => handlePlayerChange(3, e.target.value)} />
        </div>
        <div className="mb-3">
            <label htmlFor="bettingAmount" className="form-label">Money to bet (18 Holes)</label>
            <input
                type="number"
                className="form-control"
                name="bettingAmount"
                value={bettingAmount}
                onChange={(e) => setBettingAmount(parseInt(e.target.value))}
            />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
</div> */