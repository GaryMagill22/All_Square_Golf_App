import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DisplayRounds = () => {

    const [loaded, setLoaded] = useState(false);
    const [displayRounds, setDisplayRounds] = useState([]);



    // Grabbing all of the rounds from the database
    useEffect(() => {
        axios.get('http://localhost:8000/api/rounds')
            .then((res) => {
                setDisplayRounds(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching rounds: ${err}`)
            });
    }, []);










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
        // <div>
        //     <h1>Previous Rounds</h1>
        //     {loaded && (
        //         <table className="table table-bordered">
        //             <thead>
        //                 <tr>
        //                     <th>Players</th>
        //                     <th>Round ID</th>
        //                     <th>Score</th>
        //                     <th>Points</th>
        //                     <th>Winner</th>
        //                     <th>Amount Bet</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {displayRounds.map((round, i, score) => (
        //                     console.log("this is the score:", score),
        //                     <tr key={round._id}>
        //                         <td>{round.players.map(players => players.name)}</td>
        //                         <td>{i + 1}</td>
        //                         <td>{round.players.map(players => players.score)}</td>
        //                         <td>{round.players.map(players => players.points)}</td>
        //                         <td>{round.winners}</td>
        //                         <td>{round.amountBet}</td>
        //                     </tr>
        //                 ))}
        //             </tbody>
        //         </table>
        //     )}
        //     <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
        //         Home
        //     </Link>
        // </div>
    );
};

export default DisplayRounds;