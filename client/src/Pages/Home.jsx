import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import BottomNav from '../Components/BottomNav';
import axios from 'axios';
import { Axios } from '../helpers/axiosHelper';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lobbyId } = useParams();

    // State values
    const [games, setGames] = useState([]);
    const [course, setCourse] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [setLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };

    const openModal = () => {
        const modal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
        modal.show();
    };

    const closeModal = () => {
        const modal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
        modal.hide();
    };

    // GET ALL GAMES
    useEffect(() => {
        axios.get('/games')
            .then((res) => {
                setGames(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching games: ${err}`);
            });
    }, []);

    // GET ALL COURSES
    useEffect(() => {
        axios.get('/courses')
            .then((res) => {
                setCourse(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching games: ${err}`);
            });
    }, []);

    const handleSelect = (event, type) => {
        if (type === 'game') {
            setSelectedGame(event.target.value);
            const filteredGame = games.filter((game) => game._id === event.target.value);
            const gameName = filteredGame[0].name;
            localStorage.setItem('user_selected_game', JSON.stringify(gameName.toLowerCase()));
            return;
        } else {
            setSelectedCourse(event.target.value);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedGame || !selectedCourse) {
            alert('Kindly select the course and game values');
        }

        try {
            const response = await Axios({
                url: '/lobbys/new',
                method: 'post',
                body: {
                    selectedCourse,
                    selectedGame
                }
            });
            navigate(`/select-game/${response.lobby.lobbyId}`);
        } catch (err) {
            console.log(err)
        }
    }

    const joinRoom = () => {
        const lobbyId = lobbyId;
    }

    const handleUserUpdateIntoTheLobby = async (lobbyId, room) => {
        try {
            const storedPlayers = localStorage.getItem('players');
            const response = await axios.post(`http://localhost:8000/api/lobbys/update-users/${lobbyId}`, { updatedPlayers: JSON.parse(storedPlayers) });

            navigate(`/new/round/${lobbyId}`);
        } catch (error) {
            console.error("Error updating the lobby:", error);
        }
    }

    // To close modal after inputting the key and navigating to next page.
    useEffect(() => {
        const myModal = document.getElementById('myModal');
        const myInput = document.getElementById('myInput');

        const handleModalShown = () => {
            myInput.focus();
        };

        if (myModal) {
            myModal.addEventListener('shown.bs.modal', handleModalShown);
        }

        // This is the cleanup function
        return () => {
            if (myModal) {
                myModal.removeEventListener('shown.bs.modal', handleModalShown);
            }
        };
    }, []);

    const handleJoinRoom = async (lobbyId) => {
        const inputLobbyId = document.getElementById('lobbyIdInput').value;

        // Close the modal
        setIsModalOpen(false);

        // Use a timeout or a callback to wait for the modal to finish its closing animation (if any).
        setTimeout(() => {
            navigate(`/new/round?id=${inputLobbyId}`);
        }, 500);  // Assuming 500ms is the duration of the modal's closing animation.
    }

    return (
        <div style={{ margin: "20px", gap: "20px" }} className="btn-group-vertical">
            <Link to={"/profile"} type="button" className="btn btn-outline-primary">Profile</Link>
            <Link to={"/games"} type="button" className="btn btn-outline-primary">Games</Link>
            <Link to={"/rounds"} type="button" className="btn btn-outline-primary">Rounds</Link>
            <Link to={"/courses"} type="button" className="btn btn-outline-primary">Courses</Link>
            {/* <Link to={"/new/round"} type="button" className="btn btn-outline-primary">Create a Round</Link> */}

            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <select className='form-select' onChange={(e) => handleSelect(e, 'game')}>
                            <option>Select game</option>
                            {
                                games && games.length > 0 ? (
                                    games.map(game => (
                                        <option value={game._id} key={game._id}>{game.name}</option>
                                    ))
                                ) : (
                                    <option value=''>No games available</option>
                                )
                            }

                        </select>
                    </div>
                    {/* Courses Dropdown */}
                    <div className='mt-4'>
                        <select className='form-select' onChange={(e) => handleSelect(e, 'course')}>
                            <option>Select Course</option>
                            {
                                course && course.length > 0 ? (
                                    course.map(course => (
                                        <option value={course._id} key={course._id}>{course.name}</option>
                                    ))
                                ) : (
                                    <option value=''>No courses available</option>
                                )
                            }

                        </select>
                    </div>
                    <div className='mt-4'>
                        <button className='btn btn-success' disabled={!selectedGame || !selectedCourse}>Create Lobby</button>
                    </div>
                </form>
            </div>

            {/* <Button className="btn btn-primary" variant="primary" onClick={handleShow}>
                Join Round
            </Button> */}
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={openModal}>
                Join Game
            </button>

            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Join a Game</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <label for="lobbyIdInput">Enter the Lobby ID:</label>
                            <input type="text" id="lobbyIdInput" className="form-control" placeholder="Lobby ID" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {
                                const lobbyId = document.getElementById('lobbyIdInput').value;
                                joinRoom(lobbyId);
                                closeModal();
                                handleUserUpdateIntoTheLobby(lobbyId, `/new/round/${lobbyId}`)
                            }}>
                                Join Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}

export default Home