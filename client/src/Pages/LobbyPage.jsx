import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';



const LobbyPage = () => {
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
    const [players, setPlayers] = useState(['', '', '', '']);

    const [user, setUser] = useState([]);


    const navigate = useNavigate()


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

    // Grabbing user that is logged in and using data in session
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((error) => console.log(error));

        // Retrieve player data from local storage
        const storedPlayers = localStorage.getItem('players');
        if (storedPlayers) {
            setPlayers(JSON.parse(storedPlayers));
        }
    }, []);


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




    // Grabbing user that is logged in and using data in session
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch()
    }, [])




    // Function to handle game selection
    const handleGameSelection = (game) => {
        console.log(game)
        setGamePicked(game);
    };


    // Function to handle course selection
    const handleCourseSelection = (course) => {
        console.log(course)
        setCoursePicked(course);

    };


    const handlePlayerChange = (index, value) => {
        // console.log(user, 'from within hamndle player change func')
        players[0] = user.username
        const updatedPlayers = [...players];
        updatedPlayers[index] = value;
        console.log(updatedPlayers)
        setPlayers(updatedPlayers);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(players, 'checking if the user got added to localst')
        // Store the player data in local storage
        localStorage.setItem('players', JSON.stringify(players));
        navigate('/new/game')
    }


    return (
        <div>
            <div>
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
            </div>
            <div style={{ width: "500px", margin: "0 auto" }} >
                <h1>Add Players</h1>
                <form onSubmit={handleSubmit} >
                    <div className="mb-3">
                        <label htmlFor="player1" className="form-label">Player 1</label>
                        <input type="text" className="form-control" id="player1" value={user.username} onChange={(e) => handlePlayerChange(0, e.target.value)} />
                    </div>
                    <div class="mb-3">
                        <label htmlFor="player2" className="form-label">Player 2</label>
                        <input type="text" className="form-control" id="player2" value={players[1]} onChange={(e) => handlePlayerChange(1, e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="player3" className="form-label">Player 3</label>
                        <input type="text" className="form-control" id="player3" value={players[2]} onChange={(e) => handlePlayerChange(2, e.target.value)} />
                    </div>
                    <div class="mb-3">
                        <label htmlFor="player4" className="form-label">Player 4</label>
                        <input type="text" className="form-control" id="player4" value={players[3]} onChange={(e) => handlePlayerChange(3, e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            <div>
                <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default LobbyPage;


