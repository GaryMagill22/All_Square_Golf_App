import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../Components/BottomNav';
import io from 'socket.io-client';
import { useAppContext } from '../helpers/context';
import axios from 'axios';
import { Axios } from '../helpers/axiosHelper';


const Home = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [course, setCourse] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [setLoaded] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };
    const handleShow = () => {
        navigate("/new/round")
        setShow(true)
    };
    const { socket } = useAppContext();


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


    const handleSelect = (event, type) => {
        if (type === 'game') {
            setSelectedGame(event.target.value);
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
            navigate(`/new/round?id=${response.lobby.lobbyId}`);
        } catch (err) {
            console.log(err)
        }
        console.log(selectedCourse, selectedGame);
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
                        <button className='btn btn-success'>Create Lobby</button>
                    </div>
                </form>
            </div>

            {/* <Button className="btn btn-primary" variant="primary" onClick={handleShow}>
                Join Round
            </Button> */}
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Join Game
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>





            <BottomNav />
        </div>
    )
}

export default Home


