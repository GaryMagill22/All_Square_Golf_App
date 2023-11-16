import React, { useEffect, useState, useRef, Fragment } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Transition, Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CheckIcon, UserIcon, PlayCircleIcon, MapPinIcon, TrophyIcon } from '@heroicons/react/24/outline';
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
    // validation for empty game/course
    const [showValidationMessage, setShowValidationMessage] = useState(false);

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


    // old way of handling select with Bootstrap
    // const handleSelect = (event, type) => {
    //     if (type === 'game') {
    //         setSelectedGame(event.target.value);
    //         const filteredGame = games.filter((game) => game._id === event.target.value);
    //         const gameName = filteredGame[0].name;
    //         localStorage.setItem('user_selected_game', JSON.stringify(gameName.toLowerCase()));
    //         return;
    //     } else {
    //         setSelectedCourse(event.target.value);
    //     }
    // }


    // New way of handling select with Tailwind
    const handleSelect = (item, type) => {
        if (type === 'game') {
            setSelectedGame(item);
            // const filteredGame = games.filter((game) => game._id === selectedGame);
            // const gameName = filteredGame[0].name;
            localStorage.setItem('user_selected_game', JSON.stringify(item.name.toLowerCase()));
            return;
        } else if (type === 'course') {
            setSelectedCourse(item);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedGame || !selectedCourse) {
            // alert('Kindly select the course and game values');
            setShowValidationMessage(true); // Hide validation message
            setTimeout(() => setShowValidationMessage(false), 2000);
            return;
        }
        setShowValidationMessage(false); // Hide validation message

        try {
            const response = await Axios({
                url: '/lobbys/new',
                method: 'post',
                body: {
                    selectedCourse,
                    selectedGame
                }
            });
            console.log("Form submitted with", selectedGame, selectedCourse);
            if (response && response.data && response.data.lobby) {
                navigate(`/select-game/${response.data.lobby.lobbyId}`); // Ensure the path matches your app's routes
            }
            navigate(`/select-game/${response.lobby.lobbyId}`);
        } catch (err) {
            console.error("Error submitting form:", err);
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
            <nav className="flex items-center justify-center overflow-y-auto m:h-screen mr-1" aria-label="Sidebar">
                <ul role="options" className="-flex flex-col space-y-4">
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


            <div className="flex justify-center " >
                <form onSubmit={handleSubmit} className="space-x-4">
                    <Menu as="div" className="relative inline-block text-left mt-4">
                        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                            {selectedGame ? selectedGame.name : "Select Game"}
                            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {games && games.length > 0 ? (
                                        games.map((game) => (
                                            <Menu.Item key={game._id}>
                                                {({ active }) => (
                                                    <button
                                                        type="button"
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                            } block w-full px-4 py-2 text-sm text-left`}
                                                        onClick={() => handleSelect(game, 'game')}
                                                    >
                                                        {game.name}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-700">No games available</div>
                                    )}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    {/* Courses Dropdown */}
                    <Menu as="div" className="relative inline-block text-left mt-4">
                        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                            {selectedCourse ? selectedCourse.name : "Select Course"}
                            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {course && course.length > 0 ? (
                                        course.map((course) => (
                                            <Menu.Item key={course._id}>
                                                {({ active }) => (
                                                    <button
                                                        type="button"
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                            } block w-full px-4 py-2 text-sm text-left`}
                                                        onClick={() => handleSelect(course, 'course')}
                                                    >
                                                        {course.name}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-700">No games available</div>
                                    )}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <div className='flex justify-center mt-4 mr-3'>
                        <button
                            type="submit"
                            // disabled={!selectedGame || !selectedCourse}
                            className={`w-40 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${selectedGame && selectedCourse ? 'bg-gray-normal' : 'bg-maroon-normal'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light`}
                        >
                            Create Lobby
                        </button>
                        <div >
                            {showValidationMessage && (
                                <p className="text-red-500 text-xs italic mt-2">
                                    Please select Game and Course.
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex justify-center mt-4" >
                <button type="button" className="w-40 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light" onClick={openModal}>
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
                                <Dialog.Panel className="bg-gray-normal relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    {/* Modal Content Here */}
                                    <div className=" bg-gray-normal modal-body">
                                        <label htmlFor="lobbyIdInput" className="block text-md text-center font-medium text-white">
                                            Enter Lobby ID Code:
                                        </label>
                                        <input
                                            type="text"
                                            id="lobbyIdInput"
                                            className="bg-gray-light mt-1 block w-full px-3 py-2 border rounded-full focus:outline-none focus:ring focus:ring-maroon-normal sm:text-md text"
                                            placeholder="Lobby ID"
                                        />
                                    </div>
                                    <div className="bg-gray-normal modal-footer inline-flex justify-center space-x-3">
                                        <button
                                            type="button"
                                            className="rounded-full inline-flex border-solid border-4 border-salmon-light px-4 py-2 text-sm font-medium text-maroon-normal bg-gray-light hover:bg-maroon-normal hover:text-white focus:outline-gray-dark "
                                            onClick={closeModal}
                                            ref={cancelButtonRef}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-full inline-flex justify-center border-solid border-4 border-salmon-light px-4 py-2 text-sm font-medium text-maroon-normal bg-gray-light hover:bg-maroon-normal hover:text-white focus:outline-gray-dark"
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