import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import ScoreCard from '../Components/ScoreCard';
import generateRandomRoomName from '../helpers/roomKeyGenarator';
import { getSocket } from '../helpers/socketHelper';
import io from 'socket.io-client';
import TeamLobby from '../Components/TeamLobby';

const LobbyPage = () => {
    // grabbing the lobbyId from url of Home.jsx Page to use on this page.
    const location = useLocation();
    // const parsed = queryString.parse(location.search);
    // const lobbyId = parsed.id;
    const { lobbyId } = useParams();


    const socket = getSocket();
    // state for setting what game user picks

    const [selectedGame, setSelectedGame] = useState(JSON.stringify(localStorage.getItem('selectedGameName')));
    console.log('selectedGame===::', selectedGame);

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

    const [roomKey, setRoomKey] = useState('');
    const [isCreator, setIsCreator] = useState(false);
    // state to show or not show team lobby

    const [gameMode, setGameMode] = useState('normal');
    const [teams, setTeams] = useState([]); // For teams data
    const [showTeamLobby, setShowTeamLobby] = useState(false);




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

            socket.on('proceedToGameReceived', (data) => {
                if (data.status) {
                    // save lobbyId temporarily in local storage
                    localStorage.setItem('lobby', lobbyId);
                    navigate('/new/game');
                } else {
                    alert(data.message);
                }
            });

            socket.on('setBettingAmountReceived', (data) => {
                localStorage.setItem('bettingAmount', data);
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


    const addPlayerToTeam = (playerId, teamId) => {
        socket.emit('addPlayerToTeam', { playerId, teamId, lobbyId });
    };



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





    // // Function to handle game selection
    // const handleGameSelection = (game) => {
    //     // console.log(game)
    //     setGamePicked(game);
    // };


    // // Function to handle course selection
    // const handleCourseSelection = (course) => {
    //     // console.log(course)
    //     setCoursePicked(course);

    // };


    // const handlePlayerChange = (index, value) => {
    //     // console.log(user, 'from within hamndle player change func')
    //     // players[0] = user.username;// 
    //     const updatedPlayers = [...players];
    //     updatedPlayers[index] = value;
    //     // console.log(updatedPlayers)
    //     setPlayers(updatedPlayers);
    // }

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
        socket.emit('proceedToGame', gamePayload);
    }


    useEffect(() => {
        if (selectedGame) {
            // Set the game mode based on the selected game
            setGameMode(selectedGame.mode);
            console.log(`selected Game Mode====: ${selectedGame.mode}`)
        }
    }, [selectedGame]);


    console.log(`selected game===`, selectedGame)
    console.log(`MATCHING ===:`, selectedGame.localeCompare("Match Play"));

    return (
        <div>
            {selectedGame.localeCompare("Match Play") == 0 ? (
                <h1>hello<TeamLobby /></h1>
            ) : (
                // Render your normal lobby content here
                <div><h1>goodbye</h1>
                    <div>
                        <h1>Lobby Code: {lobbyId}</h1>
                    </div>

                    <div className="player-container">
                        <p></p>
                    </div>

                    <div className="loadingPlayerContainer">
                        <h3>Players Loading...</h3>
                        {players.map((p, i) => {
                            return <h4 key={i}>{p.username}</h4>;
                        })}
                    </div>

                    <form className="mb-3 p-4" onSubmit={handleSubmit}>
                        <label htmlFor="bettingAmount" className="form-label">
                            Money to bet (18 Holes)
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            name="bettingAmount"
                            placeholder="Enter amount"
                            disabled={!isCreator}
                            onChange={(e) =>
                                setBettingAmount(parseInt(e.target.value))
                            }
                        />
                        <button
                            type="submit"
                            className="btn btn-primary mt-2"
                            disabled={!isCreator}
                        >
                            Submit
                        </button>
                    </form>

                    <div>
                        <Link
                            to="/home"
                            className="btn btn-outline-primary btn-sm m-2"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
export default LobbyPage;