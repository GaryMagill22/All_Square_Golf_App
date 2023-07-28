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
        <div>
            <h1>Previous Rounds</h1>
            {loaded && (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Round ID</th>
                            <th>Round Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRounds.map((round, i) => (
                            <tr key={round._id}>
                                <td>{i + 1}</td>
                                <td>{round._id}</td>
                                <td>{JSON.stringify(round)}</td>
                                {/* Add more table cells here for additional round details */}
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

