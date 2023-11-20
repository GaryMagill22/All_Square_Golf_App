import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

export default function SelectGameType() {
    const navigate = useNavigate();
    const { lobbyId } = useParams();

    const selectedGame = JSON.parse(localStorage.getItem('user_selected_game'));


    // ComponentDidMount
    console.log("SelectGameType Component Mounted");
    console.log("Lobby ID:", lobbyId);
    console.log('Selected Game:(from SelectGame.jsx)‚', selectedGame);

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
        <div>
            <div className="mt-4">
                <h2>Select a game type to play</h2>
                <div className="mt-5">
                    {
                        (isIndividual || isTeamPlay) && <h5>Selected game: {isIndividual ? 'Individual' : 'Team'}</h5>
                    }

                </div>
                <div class="d-grid gap-5 col-6 mx-auto mt-5">
                    <button class="btn btn-primary px-4 py-4" type="button" onClick={() => handleRedirect('individual')}>
                        {
                            isIndividual && <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="white">
                                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                            </svg>
                        }
                        <span className="ml-2">Individual play</span>
                    </button>
                    <button class="btn btn-info px-4 py-4" type="button" onClick={() => handleRedirect('team')}>
                        {
                            isTeamPlay && <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="white">
                                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                            </svg>
                        }
                        <span className="ml-2">Team play</span>
                    </button>
                </div>
            </div>
        </div>
    )
}