import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Axios } from '../helpers/axiosHelper';





const GamesPage = () => {
    const [games, setGames] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null); // Track the active accordion item


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

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (


        <div className="container mx-auto p-4 bg-gray-dark">
            <div>
                <h1 className="text-3xl font-semibold text-center text-indigo-light">Games</h1>
            </div>
            {loaded ? (
                <div id="accordion-color" data-accordion="collapse">
                    {games.map((game, index) => (
                        <div key={game._id}>
                            <h4 id={`accordion-color-heading-${index}`}>
                                <button type="button" className="flex items-center justify-between w-full p-2 text-sm font-medium text-white text-center border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-salmon-light dark:border-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800 gap-2" onClick={() => toggleAccordion(index)} aria-expanded={activeIndex === index}>
                                    <span>{game.name}</span>
                                    <svg className={activeIndex === index ? 'transform rotate-180 w-3 h-3' : 'w-3 h-3'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                    </svg>
                                </button>
                            </h4>
                            <div id={`accordion-color-body-${index}`} className={activeIndex === index ? 'block' : 'hidden'} aria-labelledby={`accordion-color-heading-${index}`}>
                                <div className="p-5 mb-2 rounded-xl border-2 border-b-0 border-indigo-light dark:border-indigo-light dark:bg-gray-light">
                                    <p className="text-black dark:text-white">{game.howToPlay}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading games...</p>
            )}
            <div className="mt-4">
                <Link to="/home" className="inline-block leading-6 text-center w-60 py-2 px-4 border border-transparent text-sm font-medium text-white bg-maroon-normal hover:no-underline rounded-md hover:bg-cyan-normal focus:outline-none focus:ring">
                    Home
                </Link>
            </div>
        </div>
    );
};


export default GamesPage;


{/* <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-gray-dark min-h-screen">
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
        </main> */}