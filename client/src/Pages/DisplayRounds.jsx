import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';

const DisplayRounds = () => {
    const [displayRounds, setDisplayRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/api/rounds')
            .then((res) => {
                const processedRounds = res.data.map(round => {
                    const roundDate = round.createdAt ? new Date(round.createdAt) : new Date();
                    const formattedDate = !isNaN(roundDate.getTime()) ? roundDate.toLocaleDateString('en-US') : 'Not available';
                    return { ...round, formattedDate };
                });
                setDisplayRounds(processedRounds);
            })
            .catch((err) => {
                console.error(`Error fetching rounds: ${err}`);
            });
    }, []);


    // get All rounds from database
    // useEffect(() => {
    //     // Retrieve the user ID from local storage
    // const userId = JSON.parse(localStorage.getItem('user_id'));


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


    const openModal = (round) => {
        setSelectedRound(round);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Previous Rounds</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRounds.map((round) => (
                    <div
                        key={round._id}
                        className="card bg-white rounded-lg border border-gray-200 shadow-md p-4 cursor-pointer"
                        onClick={() => openModal(round)}
                    >
                        <div className="card-body">
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
            <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                Home
            </Link>
        </div>
    );
};

export default DisplayRounds;
