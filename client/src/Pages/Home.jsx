import React, { useEffect, useState, useRef, Fragment } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, HomeIcon, UserIcon, PlayCircleIcon, MapPinIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Axios } from '../helpers/axiosHelper';
import logo from '../assets/All_Square_Logo.png'; // Adjust the path if your assets folder is structured differently



const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lobbyId } = useParams();

    // State values
    const [games, setGames] = useState([]);
    const [course, setCourse] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };

    // Tailwind css Modal 
    const [open, setOpen] = useState(false);

    // const openModal = () => setOpen(true);
    // const closeModal = () => setOpen(false);


    const cancelButtonRef = useRef(null)

    const openModal = () => {
        setIsModalOpen(true);
        setOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setOpen(false);
    };


    // Navbar setup 
    const navigation = [
        { name: 'Profile', to: '/profile', icon: UserIcon, current: false }, // Replace HomeIcon with the icon you want for Profile
        { name: 'Games', to: '/games', icon: PlayCircleIcon, current: false }, // Home page, assuming it's the root
        { name: 'Rounds', to: '/rounds', icon: TrophyIcon, current: false }, // Replace HomeIcon with the icon for Games
        { name: 'Courses', to: '/courses', icon: MapPinIcon, current: false }, // Replace HomeIcon with the icon for Courses
        // Add more items as needed
    ]

    // Navbar settup function
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    };


    // GET ALL GAMES
    useEffect(() => {
        axios.get('/games')
            .then((res) => {
                setGames(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching games: ${err}, ${err.stack}`);
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
                console.log(`Error fetching courses: ${err}, ${err.stack}`);
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
        const inputLobbyId = document.getElementById('lobbyIdInput').value;
        // const lobbyId = lobbyId;
    }


    // had to change url for sockets to work on local host -
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
    // useEffect(() => {
    //     const myModal = document.getElementById('myModal');
    //     const myInput = document.getElementById('myInput');

    //     const handleModalShown = () => {
    //         myInput.focus();
    //     };

    //     if (myModal) {
    //         myModal.addEventListener('shown.bs.modal', handleModalShown);
    //     }

    //     // This is the cleanup function
    //     return () => {
    //         if (myModal) {
    //             myModal.removeEventListener('shown.bs.modal', handleModalShown);
    //         }
    //     };
    // }, []);

    const handleJoinRoom = async (lobbyId) => {
        const inputLobbyId = document.getElementById('lobbyIdInput').value;

        // Close the modal
        // setIsModalOpen(false);

        // Use a timeout or a callback to wait for the modal to finish its closing animation (if any).
        setTimeout(() => {
            navigate(`/new/round?id=${inputLobbyId}`);
        }, 500);  // Assuming 500ms is the duration of the modal's closing animation.
    }

    return (
        <div className="bg-gray-900 min-h-screen overflow-hidden">
            <div className="flex justify-center items-center w-full">
                <img className="max-w-full h-auto ml-3" src={logo} alt="All Square Logo" />
            </div>
            <nav className="flex items-center justify-center overflow-y-auto m:h-screen" aria-label="Sidebar">
                <ul role="list" className="-flex flex-col space-y-4">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.to}
                                className="w-30 pr-3 bg-gray-light text-black hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-full p-1.5 text-md leading-6 font-semibold hover:no-underline"
                            >
                                <item.icon
                                    className={classNames(
                                        item.current ? 'text-black' : 'textwhite group-hover:text-maroon-dark',
                                        'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>


            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <select className='mt-4' onChange={(e) => handleSelect(e, 'game')}>
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
                        <select onChange={(e) => handleSelect(e, 'course')}>
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
                        <button className='btn btn-success' disabled={!selectedGame}>Create Lobby</button>
                    </div>
                </form>
            </div>

            {/* <Button className="btn btn-primary" variant="primary" onClick={handleShow}>
                Join Round
            </Button> */}

            <div className="mt-4" >
                <button type="button" className="btn btn-primary" onClick={openModal}>
                    Join Game
                </button>
            </div>

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    {/* Modal Content Here */}
                                    <div className="modal-body">
                                        <label htmlFor="lobbyIdInput" className="block text-sm font-medium text-gray-700">
                                            Enter Lobby ID:
                                        </label>
                                        <input
                                            type="text"
                                            id="lobbyIdInput"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Lobby ID"
                                        />
                                    </div>
                                    <div className="modal-footer flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={closeModal}
                                            ref={cancelButtonRef}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                                const lobbyId = document.getElementById('lobbyIdInput').value;
                                                closeModal();
                                                joinRoom(lobbyId);
                                                handleUserUpdateIntoTheLobby(lobbyId, `/new/round/${lobbyId}`);
                                            }}
                                        >
                                            Join Game
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    )
}

export default Home