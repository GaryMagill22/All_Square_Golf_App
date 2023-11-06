import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DisplayRounds = () => {

    const [loaded, setLoaded] = useState(false);
    const [displayRounds, setDisplayRounds] = useState([]);



    // Grabbing all of the rounds from the database
    useEffect(() => {
        axios.get('https://allsquare.club/api/rounds')
            .then((res) => {
                setDisplayRounds(res.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(`Error fetching rounds: ${err}`)
            });
    }, []);










    return (
        <div>
            <h1>Previous Rounds</h1>
            {loaded && (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Players</th>
                            <th>Round ID</th>
                            <th>Score</th>
                            <th>Points</th>
                            <th>Winner</th>
                            <th>Amount Bet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRounds.map((round, i, score) => (
                            console.log("this is the score:", score),
                            <tr key={round._id}>
                                <td>{round.players.map(players => players.name)}</td>
                                <td>{i + 1}</td>
                                <td>{round.players.map(players => players.score)}</td>
                                <td>{round.players.map(players => players.points)}</td>
                                <td>{round.winners}</td>
                                <td>{round.amountBet}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                Home
            </Link>
        </div>
    );
};

export default DisplayRounds;