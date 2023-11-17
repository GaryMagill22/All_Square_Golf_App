import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
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
        axios.get('https://allsquare.club/api/games')
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
            .get(`https://allsquare.club/api/users/getUser`, { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (lobbyId)
            axios
                .get(`https://allsquare.club/api/lobbys/get-users-in-room/${lobbyId}`)
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
        axios.get('https://allsquare.club/api/courses')
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
        <div className=' flex flex-col container min-h-screeen bg-gray-dark   mx-auto p-4'>
            <div className="bg-gray-light dark:bg-gray-light shadow rounded-lg p-4 mb-4 flex-grow border-2 border-salmon-light">
                <h1 class="mb-4 text-3xl font-extrabold text-gray-normal dark:text-gray-dark md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-blue-normal from-maroon-normal">Lobby Code:</span> {lobbyId}</h1>
                <p class="text-lg font-normal text-black lg:text-lg dark:text-gray-400">Give Lobby Code to playing partners; Note that it is case sensative.</p>
                {/* <h1 className="text-xl font-semibold">Lobby Code: {lobbyId}</h1> */}
            </div>

            {/* Player Loading Section */}
            <div className="bg-gray-light dark:bg-gray-light shadow rounded-lg p-4 mb-6 flex-grow border-2 border-salmon-light">
                <h3 className="font-bold text-white">Players</h3>
                <div className="justify-center space-y-2">
                    {players.map((p, i) => (
                        <div key={i} className="flex justify-center items-center space-x-2 space-y-0">
                            <div className="flex-shrink-0">
                                <div className="w-6 h-6 overflow-hidden bg-salmon-light rounded-full dark:bg-blue-dark">
                                    <svg className="w-full h-full text-salmon-light" fill="currentColor" viewBox="2 0 15 10" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 5a2 2 0 100-4 2 2 0 000 4zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                            <h5 className=" text-gray-800 dark:text-blue-dark">{p.username}</h5>
                        </div>
                    ))}
                </div>
            </div>




            {/* Team Creation Section */}
            {isCreator && gameType === 'team' && (
                <div className="bg-gray-light dark:bg-gray-light shadow rounded-lg p-4 mb-6 flex flex-col border-2 border-salmon-light">
                    <p>Note: Create two teams and add users to each team to be able to participate in the game</p>
                    <div className="space-y-4">
                        <div className='flex flex-col md:flex-row items-center gap-4 flex-grow'>
                            <input className='form-control flex-grow' placeholder='Enter team name' onChange={(e) => setTeamValue(e.target.value)} />
                            <button className='btn btn-success' onClick={handleCreateTeam}>Create team</button>
                        </div>
                        <div>
                            <h5>Add Players to team</h5>
                            <div className='flex flex-col md:flex-row items-center gap-4 border-2 border-salmon-light'>
                                <select className='form-control flex-grow' onChange={(e) => setSelectedTeam(e.target.value)}>
                                    <option value="Nil">Select team</option>
                                    {teams.map((team, index) => (
                                        <option key={index} value={team.teamName}>{team.teamName}</option>
                                    ))}
                                </select>
                                <select className='form-control flex-grow' onChange={(e) => setSelectedPlayer(e.target.value)}>
                                    <option value="Nil">Select player</option>
                                    {players.map((player, index) => (
                                        <option key={index} value={player.username}>{player.username}</option>
                                    ))}
                                </select>
                                <button className='btn btn-info' onClick={addPlayerToTeam}>Add player to team</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Teams Display Section */}
            {gameType === 'team' && (
                <div className="flex flex-col bg-gray-light dark:bg-gray-light shadow rounded-lg p-4 mb-6 border-2 border-salmon-light">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow'>
                        {teams.length > 0 ? teams.map((item, index) => (
                            <div key={index} className='border border-gray-200 rounded-lg p-4'>
                                <h4 className="font-semibold">{item.teamName}</h4>
                                {item.players && (
                                    <ul className="list-disc pl-5">
                                        {item.players.map((data) => (
                                            <li key={data.id} className='mt-2'>
                                                {data.name}
                                                <button className='ml-2 text-red-500' onClick={() => removeUserFromTeam(data.id, item.teamName)}>x</button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )) : <p>No teams available...</p>}
                    </div>
                </div>
            )}
            {/* Betting Amount Section */}
            <div className="bg-gray-light dark:bg-gray-light shadow rounded-lg p-4 mb-6 border-2 border-salmon-light">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="bettingAmount" className="block text-lg font-medium text-gray-700">Bet Amount</label>
                        <input type="number" className="mt-1 block w-full border-2 border-salmon-light rounded-md shadow-sm focus:border-blue-dark focus:ring-blue-dark sm:text-sm" name="bettingAmount" placeholder='Enter amount' disabled={!isCreator} onChange={(e) => setBettingAmount(parseInt(e.target.value))} />
                    </div>
                    <button type="submit" disabled={!isCreator} className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">Submit</button>
                </form>
            </div>
            <div className="mt-2">
                <Link to="/home" disabled={!isCreator} className="w-9/12 inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-gray-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                    Home
                </Link>
            </div>
        </div>






    );
};


export default LobbyPage;