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

        <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-gray-dark min-h-screen">
            <div className="text-center">
                <p className="text-base font-semibold text-blue-light">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                <p className="mt-6 text-white leading-7">Sorry, we couldn’t find the page you’re looking for.</p>
                
            </div>
            <div className="mt-2">
                        <Link to="/home" className="w-9/12 inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                            Back
                        </Link>
                    </div>
        </main>
        // <div className="accordion" id="accordionExample">
        //     {loaded &&
        //         games.map((game, i) => {
        //             const isGameActive = (activeGame === game.id);

        //             return (
        //                 <div className="accordion-item" key={i}>
        //                     <h2 className="accordion-header">
        //                         <button
        //                             className="accordion-button"
        //                             type="accordion-button"
        //                             data-bs-toggle="collapse"
        //                             data-bs-target={`#collapse${i}`}
        //                             aria-expanded="false"
        //                             aria-controls={`#collapse${i}`}

        //                             onChange={() => handleGameClick(game.id)}
        //                         >
        //                             {game.name}
        //                         </button>
        //                     </h2>
        //                     <div
        //                         id={`collapse${i}`}
        //                         className="accordion-collapse collapse"
        //                         aria-labelledby={`heading${game.id}`}
        //                         data-bs-parent="#accordionExample"
        //                     >
        //                         <div className="accordion-body">
        //                             {game.howToPlay}
        //                         </div>
        //                     </div>
        //                 </div>
        //             );
        //         })}
        //     <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
        //         Home
        //     </Link>
        // </div>
    );
};

export default GamesPage;



