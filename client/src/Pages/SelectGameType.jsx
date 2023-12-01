import React, { useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function SelectGameType() {
    const navigate = useNavigate();
    const { lobbyId } = useParams();

    // State values declaration
    const [isIndividual, setIsIndividual] = useState(false);
    const [isTeamPlay, setIsTeamPlay] = useState(false);

    const handleRedirect = (gameType) => {
        if (gameType === 'individual') {
            setIsIndividual(true);
            setIsTeamPlay(false);
            navigate(`/new/round/${gameType}/${lobbyId}`);
        } else {
            setIsIndividual(false);
            setIsTeamPlay(true);
            navigate(`/new/round/${gameType}/${lobbyId}`);
        }
    }

    return (
        <div className="bg-gray-dark min-h-screen">
            <div className="pt-4 text-center">
                <h2 className="text-white text-2xl font-bold">Select Game Type</h2>
                {(isIndividual || isTeamPlay) && (
                    <h5 className="text-white mt-2">Selected game: {isIndividual ? 'Individual' : 'Team'}</h5>
                )}
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 mt-5 mx-auto p-4">
                    {/* Individual Play Card */}
                    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-maroon-normal dark:text-blue-dark">Individual Play</h5>
                        <p className="mb-3 font-normal text-gray-dark dark:text-gray-dark">Play others individually - every man for themselves.</p>
                        <button onClick={() => handleRedirect('individual')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-normal rounded-lg hover:bg-blue-dark focus:ring-4 focus:outline-none focus:ring-salmon-light dark:bg-blue-noaml dark:hover:bg-blue-dark dark:focus:ring-blue-800">
                            Select
                        </button>
                    </div>

                    {/* Team Play Card */}
                    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-blue-dark">Team Play</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-dark">Play as a team. Choose your team and compete together.</p>
                        <button onClick={() => handleRedirect('team')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-normal rounded-lg hover:bg-blue-dark focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-normal dark:hover:bg-blue-dark dark:focus:ring-salmon-light">
                            Select
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <Link to="/home" className="w-40 inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                    Back
                </Link>
            </div>
        </div>
    )
}