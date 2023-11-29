import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';

const DisplayRounds = () => {
    const [displayRounds, setDisplayRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // get All rounds from database
    // useEffect(() => {
    //     axios.get('http://localhost:8000/api/rounds')
    //         .then((res) => {
    //             const processedRounds = res.data.map(round => {
    //                 const roundDate = round.createdAt ? new Date(round.createdAt) : new Date();
    //                 const formattedDate = !isNaN(roundDate.getTime()) ? roundDate.toLocaleDateString('en-US') : 'Not available';
    //                 return { ...round, formattedDate };
    //             });
    //             setDisplayRounds(processedRounds);
    //         })
    //         .catch((err) => {
    //             console.error(`Error fetching rounds: ${err}`);
    //         });
    // }, []);


    // Get rounds from database only having the user ID that exists in players array    


    useEffect(() => {
        // Retrieve the user ID from local storage
        const userId = JSON.parse(localStorage.getItem('user_id'));
        console.log('userId:', userId);

        if (userId) {
            axios.get(`http://localhost:8000/api/rounds/user/${userId}`)
                .then((res) => {
                    console.log("Rounds received:", res.data);
                    const processedRounds = res.data.map(round => {
                        const roundDate = round.createdAt ? new Date(round.createdAt) : new Date();
                        const formattedDate = !isNaN(roundDate.getTime()) ? roundDate.toLocaleDateString('en-US') : 'Not available';
                        return { ...round, formattedDate };
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

    return (
        <div className="container bg-gray-dark mx-auto p-4">
            <h1 className="text-2xl text-white font-bold mb-4">Previous Rounds</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRounds.map((round) => (
                    <div
                        key={round._id}
                        className="card bg-white rounded-lg border border-salmon-light shadow-md p-4 cursor-pointer"
                        onClick={() => openModal(round)}
                    >
                        <div className="card-body bg-gray-lightest">
                            <h5 className="card-title text-lg">Date: {round.formattedDate}</h5>
                            <h5 className="text-lg text-gray-600">Course: {round.course || "Not specified"}</h5>
                            <h5 className="text-lg">Players: {round.players.length > 0 ? round.players.map(player => player.name).join(', ') : "No players"}</h5>
                        </div>
                    </div>
                ))}
            </div>


            {isModalOpen && selectedRound && (
                <Dialog open={isModalOpen} onClose={closeModal} className="relative z-10">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                            <Dialog.Title className="text-lg font-bold">Round Details</Dialog.Title>
                            <div className="mt-2">
                                <p>Game: {selectedRound.game}</p>
                                <p>Date: {selectedRound.formattedDate}</p>
                                <p>Course: {selectedRound.course}</p>
                                <p>Players: {selectedRound.players.map(player => player.name).join(', ')}</p>

                                {/* Scorecard Table */}
                                <table className="min-w-full divide-y divide-gray-200 mt-4">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Player
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Points
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedRound.players.map((player, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {player.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {player.score}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {player.points}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
            <div className="mt-4">
                <Link to="/home" className="inline-block leading-6 text-center w-60 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white text-white bg-maroon-normal rounded-md hover:bg-blue-600 focus:outline-none focus:ring">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default DisplayRounds;
