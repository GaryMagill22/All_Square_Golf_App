import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Axios } from '../helpers/axiosHelper';




const GamesPage = () => {
    const [games, setGames] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [activeGame, setActiveGame] = useState(null);

    useEffect(() => {

        // environment variables for local/production
        const apiURL = process.env.REACT_APP_API_URL;

        axios.get(`${apiURL}/api/games`)
            .then((res) => {
                setActiveGame(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching games: ${err}`);
            });
    }, []);


    const handleGameClick = (gameId) => {
        setActiveGame(gameId);
        // saving game selected to local storage //
        console.log('HELLO');
    };

    return (
        <div className="accordion" id="accordionExample">
            {loaded &&
                games.map((game, i) => {
                    const isGameActive = (activeGame === game.id);

                    return (
                        <div className="accordion-item" key={i}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button"
                                    type="accordion-button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${i}`}
                                    aria-expanded="false"
                                    aria-controls={`#collapse${i}`}

                                    onChange={() => handleGameClick(game.id)}
                                >
                                    {game.name}
                                </button>
                            </h2>
                            <div
                                id={`collapse${i}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${game.id}`}
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">
                                    {game.howToPlay}
                                </div>
                            </div>
                        </div>
                    );
                })}
            <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                Home
            </Link>
        </div>
    );
};

export default GamesPage;



