import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';

const DisplayRounds = () => {
    const [displayRounds, setDisplayRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user_id'));

        if (userId) {
            axios.get(`http://localhost:8000/api/rounds/user/${userId}`)
                .then((res) => {
                    const processedRounds = res.data.map(round => {
                        const roundDate = round.createdAt ? new Date(round.createdAt) : new Date();
                        const formattedDate = !isNaN(roundDate.getTime()) ? roundDate.toLocaleDateString('en-US') : 'Not available';
                        const gameType = round.teams && round.teams.length > 0 ? 'team' : 'individual';
                        return { ...round, formattedDate, gameType };
                    });
                    setDisplayRounds(processedRounds);
                })
                .catch((err) => {
                    console.error(`Error fetching rounds for user ${userId}:`, err);
                });
        } else {
            console.error("User ID not found in localStorage");
        }
    }, []);

    const openModal = (round) => {
        setSelectedRound(round);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    // Individual Round Function Details for modal
    const IndividualRoundDetails = ({ round }) => (
        <div className="overflow-x-auto mt-4 border-2 border-salmon-light">
            <table className="w-full divide-y ">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Player</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Score</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Points</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-lightest divide-y">
                    {round.players.map((player, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{player.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{player.score}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{player.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Team Round Function Details for modal
    const TeamRoundDetails = ({ round }) => (
        <div className="overflow-x-auto mt-4 border-2 border-salmon-light">
            <table className="w-full divide-y">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Team</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Score</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Points</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Players</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-lightest divide-y">
                    {round.teams.map((team, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{team.teamName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{team.teamScore}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{team.teamPoints}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{team.players.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="container bg-gray-dark mx-auto p-4">
            <h1 className="text-2xl text-salmon-light font-bold mb-4">Previous Rounds</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRounds.map((round) => (
                    <div
                        key={round._id}
                        className="card bg-white rounded-lg border border-salmon-light shadow-md p-4 cursor-pointer"
                        onClick={() => openModal(round)}
                    >
                        <div className="card-body bg-gray-light">
                            <h5 className="card-title">Date: {round.formattedDate}</h5>
                            <h5>Game Type: {round.gameType}</h5>
                            <h5 className="text-lg text-black">Course: {round.course || "Not specified"}</h5>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedRound && (
                <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        <div className="w-full max-w-md mx-auto bg-gray-dark rounded-lg shadow-xl border-2 border-salmon-light transform transition-all">
                            <div className="p-4">
                                <Dialog.Title className="text-xxl text-white font-bold text-center">Round Details</Dialog.Title>
                                <div className="mt-4 text-center text-semibold">
                                    <p className="text-salmon-light">Game: <span className="text-orange-light">{selectedRound.game}</span></p>
                                    <p className="text-salmon-light">Date: <span className="text-orange-light">{selectedRound.formattedDate}</span></p>
                                    <p className="text-salmon-light">Course: <span className="text-orange-light">{selectedRound.course}</span></p>
                                </div>
                                {selectedRound.gameType === 'individual' ? <IndividualRoundDetails round={selectedRound} /> : <TeamRoundDetails round={selectedRound} />}
                                <div className="mt-4 flex justify-end">
                                    <button className="rounded-md bg-cyan-normal px-4 py-2 text-sm font-medium text-white hover:bg-maroon-normal" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}

            <div className="mt-4">
                <Link to="/home" className="inline-block leading-6 text-center w-60 py-2 px-4 border border-transparent text-sm font-medium text-white bg-maroon-normal rounded-md hover:bg-blue-600 focus:outline-none focus:ring">Home</Link>
            </div>
        </div>
    );
};

export default DisplayRounds;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Dialog } from '@headlessui/react';
// import { Link, useParams } from 'react-router-dom';

// // Component definition
// const DisplayRounds = () => {
//     const [displayRounds, setDisplayRounds] = useState([]);
//     const [selectedRound, setSelectedRound] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalType, setModalType] = useState('individual'); // State to track the type of modal to display
//     const { gameType } = useParams();


//     // Effect to load rounds from the API
//     useEffect(() => {
//         const userId = JSON.parse(localStorage.getItem('user_id'));

//         if (userId) {
//             axios.get(`http://localhost:8000/api/rounds/user/${userId}`)
//                 .then((res) => {
//                     console.log("Rounds received:", res.data);
//                     const processedRounds = res.data.map(round => {
//                         const roundDate = round.createdAt ? new Date(round.createdAt) : new Date();
//                         const formattedDate = !isNaN(roundDate.getTime()) ? roundDate.toLocaleDateString('en-US') : 'Not available';
//                         // Infer gameType based on the properties of the round
//                         const gameType = round.teams && round.teams.length > 0 ? 'team' : 'individual';
//                         return { ...round, formattedDate, gameType };
//                     });
//                     setDisplayRounds(processedRounds);
//                 })
//                 .catch((err) => {
//                     console.error(`Error fetching rounds for user ${userId}:`, err);
//                 });
//         } else {
//             console.error("User ID not found in localStorage");
//         }
//     }, []);

//     // Function to open the modal and determine its type
//     const openModal = (round) => {
//         setSelectedRound(round);
//         // Determine if the round has team data or individual data
//         setModalType(round.teamName ? 'team' : 'individual');
//         setIsModalOpen(true);
//     };

//     // Function to close the modal
//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     // Render JSX for individual round details
//     const IndividualRoundDetails = ({ round }) => (
//         // Replace with your individual round JSX layout
//         <div>Individual round details go here</div>
//     );

//     // Render JSX for team round details
//     const TeamRoundDetails = ({ round }) => (
//         // Replace with your team round JSX layout
//         <div>Team round details go here</div>
//     );

//     // Main render method of the component
//     return (
//         <div className="container bg-gray-dark mx-auto p-4">
//             <h1 className="text-2xl text-salmon-light font-bold mb-4">Previous Rounds</h1>
//             {/* Map over the rounds and display each one */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {displayRounds.map((round) => (
//                     <div
//                         key={round._id}
//                         className="card bg-white rounded-lg border border-salmon-light shadow-md p-4 cursor-pointer"
//                         onClick={() => openModal(round)}
//                     >
//                         {/* Card content */}
//                         <div className="card-body bg-gray-light">
//                             <h5 className="card-title">Date: {round.formattedDate}</h5>
//                             <h5>Game Type: {round.gameType}</h5>
//                             <h5 className="text-lg text-black">Course: {round.course || "Not specified"}</h5>
//                             {/* Conditional rendering of players */}
//                             {round.gameType === 'individual' ?
//                                 (<h5 className="text-lg">Players: {round.players.map(player => player.name).join(', ')}</h5>) :
//                                 round.teams.map((team, index) => (
//                                     <div key={index}>
//                                         <h5 className="text-lg">Team: {team.teamName}</h5>
//                                         <p>Players: {team.players.join(', ')}</p>
//                                     </div>
//                                 ))
//                             }
//                         </div>
//                     </div>
//                 ))}

//             </div>

//             {/* Modal for displaying round details */}
//             {isModalOpen && selectedRound && (
//                 <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex min-h-screen items-center justify-center p-4 text-center">
//                         <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
//                         {/* Conditional rendering of modal content based on the type */}
//                         <div className="w-full max-w-md mx-auto bg-gray-dark rounded-lg shadow-xl border-2 border-salmon-light transform transition-all">
//                             <div className="p-4">
//                                 <Dialog.Title className="text-xxl text-white font-bold text-center">Round Details</Dialog.Title>
//                                 <div className="mt-4 text-center text-semibold">
//                                     {/* Round details */}
//                                     <p className="text-salmon-light">Game: <span className="text-orange-light">{selectedRound.game}</span></p>
//                                     <p className="text-salmon-light">Date: <span className="text-orange-light">{selectedRound.formattedDate}</span></p>
//                                     <p className="text-salmon-light">Course: <span className="text-orange-light">{selectedRound.course}</span></p>
//                                     <p className="text-salmon-light">Players: <span className="text-orange-light">{selectedRound.players && selectedRound.players.map(player => player.name).join(', ')}</span></p>
//                                 </div>
//                                 {/* Dynamic rendering based on round type */}
//                                 {modalType === 'individual' ? <IndividualRoundDetails round={selectedRound} /> : <TeamRoundDetails round={selectedRound} />}
//                                 {/* Close button */}
//                                 <div className="mt-4 flex justify-end">
//                                     <button
//                                         className="rounded-md bg-cyan-normal px-4 py-2 text-sm font-medium text-white hover:bg-maroon-normal"
//                                         onClick={closeModal}
//                                     >
//                                         Close
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </Dialog>
//             )}

//             <div className="mt-4">
//                 <Link to="/home" className="inline-block leading-6 text-center w-60 py-2 px-4 border border-transparent text-sm font-medium text-white bg-maroon-normal rounded-md hover:bg-blue-600 focus:outline-none focus:ring">
//                     Home
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default DisplayRounds;




// // {
// //     round.gameType === 'individual' ?
// //     (<h5 className="text-lg">Players: {round.players.map(player => player.name).join(', ')}</h5>) :
// //     round.teams.map((team, index) => (
// //         <div key={index}>
// //             <h5 className="text-lg">Team: {team.teamName}</h5>
// //             <p>Players: {team.players.join(', ')}</p>
// //         </div>
// //     ))
// // }