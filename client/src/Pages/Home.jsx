import React, { useEffect, useState, useRef, Fragment } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Transition, Listbox } from '@headlessui/react';
// import {  CheckIcon, PlayCircleIcon, TrophyIcon, ChevronUpDownIcon } from '@heroicons/react/outline';
import { CheckIcon, UserIcon, PlayCircleIcon, MapPinIcon, TrophyIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Axios } from '../helpers/axiosHelper';
import logo from '../assets/All_Square_Logo.png'; // Adjust the path if your assets folder is structured differently
import 'tailwindcss/tailwind.css';



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


    // New way of handling select with Tailwind
    const handleSelect = (selectedItem, type) => {
        if (type === 'game') {
            setSelectedGame(selectedItem);
            const gameName = selectedItem.name;
            localStorage.setItem('user_selected_game', JSON.stringify(gameName.toLowerCase()));
            return;
        } else if (type === 'course') {
            setSelectedCourse(selectedItem);
            const courseName = selectedItem.name; // Assuming selectedItem has a name property
            localStorage.setItem('user_selected_course', JSON.stringify(courseName));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Selected Game:', selectedGame);
        console.log('Selected Course:', selectedCourse);
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
    };


    const handleJoinRoom = async (lobbyId) => {
        const inputLobbyId = document.getElementById('lobbyIdInput').value;


        // Use a timeout or a callback to wait for the modal to finish its closing animation (if any).
        setTimeout(() => {
            navigate(`/new/round?id=${inputLobbyId}`);
        }, 500);  // Assuming 500ms is the duration of the modal's closing animation.
    }

    return (
        <div className=" bg-gray-900 min-h-screen overflow-hidden">
            <div className="flex justify-center w-full">
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
                <form onSubmit={handleSubmit} className="justify-center">
                    {/* Dropdown Menu for Games */}
                    <Listbox value={selectedGame} onChange={(item) => handleSelect(item, 'game')}>
                        {({ open }) => (
                            <>
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default mb-2 rounded-md bg-cyan-normal py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <span className="block truncate">{selectedGame ? selectedGame.name : 'Select Game'}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="form-select absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {games.map((gameItem) => (
                                                <Listbox.Option
                                                    key={games._id}
                                                    value={gameItem}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-gray-dark text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                                {gameItem.name}
                                                            </span>
                                                            {selected && (
                                                                <span
                                                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'
                                                                        }`}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>

                    {/* Listbox for Courses */}
                    <Listbox value={selectedCourse} onChange={(item) => handleSelect(item, 'course')}>
                        {({ open }) => (
                            <>
                                {/* <Listbox.Label className="block text-sm font-medium leading-6 text-white mt-1">Select Course:</Listbox.Label> */}
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-cyan-normal py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <span className="block truncate">{selectedCourse ? selectedCourse.name : 'Select Course'}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-black" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {course.map((courseItem) => (
                                                <Listbox.Option
                                                    key={course._id}
                                                    value={courseItem}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-gray-dark text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                                {courseItem.name}
                                                            </span>
                                                            {selected && (
                                                                <span
                                                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'
                                                                        }`}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                    <div className='flex flex-col items-center mt-4'>
                        <button
                            type="submit"
                            className={`w-60 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${selectedGame && selectedCourse ? 'bg-gray-normal' : 'bg-maroon-normal'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light`}
                        >
                            Create Lobby
                        </button>
                        {showValidationMessage && (
                            <p className="w-60 text-red-500 text-md italic mt-2 text-center">
                                Please select Game and Course.
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <div className="flex justify-center m-3" >
                <button type="button" className="w-60 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light" onClick={openModal}>
                    Join Game
                </button>
            </div>

            {/* Tailwind css Modal for joining Game */}
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
                                <Dialog.Panel className="bg-gray-normal relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-white transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    {/* Modal Content Here */}
                                    <div className=" bg-gray-normal modal-body">
                                        <label htmlFor="lobbyIdInput" className="block text-md text-center font-medium text-white">
                                            Enter Lobby ID Code:
                                        </label>
                                        <input
                                            type="text"
                                            id="lobbyIdInput"
                                            className="bg-gray-light mt-1 block w-full px-3 py-2 rounded-full focus:outline-none focus:ring focus:ring-salmon-light sm:text-md text"
                                            placeholder="Lobby ID"
                                        />
                                    </div>
                                    <div className="bg-gray-normal modal-footer inline-flex justify-center space-x-3">
                                        <button
                                            type="button"
                                            className="rounded-full inline-flex border-solid border-2 border-salmon-light px-4 py-2 text-sm font-medium text-maroon-normal bg-gray-light hover:bg-maroon-normal hover:text-white focus:outline-gray-dark "
                                            onClick={closeModal}
                                            ref={cancelButtonRef}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-full justify-center border-solid border-2 border-salmon-light px-4 py-2 text-sm font-medium text-maroon-normal bg-gray-light hover:bg-maroon-normal hover:text-white focus:outline-gray-dark"
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