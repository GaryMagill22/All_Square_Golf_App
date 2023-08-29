import axios from 'axios'; // Importing Axios for making HTTP requests
import 'bootstrap/dist/css/bootstrap.css'; // Importing Bootstrap CSS for styling
import React, { useEffect, useState } from 'react'; // Importing necessary React components
import { useNavigate, Link } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
import Chat from './Chat';

const ScoreCard = () => {
    const navigate = useNavigate(); // Creating a navigation function using useNavigate
    const [user, setUser] = useState([]); // State variable for the user data

    const [players, setPlayers] = useState(() => { // State variable for player data fetched from local storage
        const storedPlayers = localStorage.getItem('players');
        return storedPlayers ? JSON.parse(storedPlayers) : [];
    });
    const [isCreator, setIsCreator] = useState(JSON.parse(localStorage.getItem('creator')));
    console.log('player value', players);
    console.log('creator value', isCreator);


    const [playerScores, setPlayerScores] = useState({}); // State variable for player scores
    const [calculatedPoints, setCalculatedPoints] = useState( // State variable for calculated points for each player
        [
            { player: players[0], points: 0 },
            { player: players[1], points: 0 },
            { player: players[2], points: 0 },
            { player: players[3], points: 0 }
        ]
    );
    const [currentHoleNumber, setCurrentHoleNumber] = useState(1); // State variable to keep track of the current hole number
    const [isSubmitted, setIsSubmitted] = useState(false); // State variable to track if the score is submitted
    const [totalScores, setTotalScores] = useState({}); // State variable for the total scores
    const [winners, setWinners] = useState([]); // State variable to track winners
    const [bettingAmount, setBettingAmount] = useState(0); // State for how much money betting.
    const [gamePicked, setGamePicked] = useState();
    const [coursePicked, setCoursePicked] = useState('');


    const [roundData, setRoundData] = useState({});

    const scoreUpdating = Object.values(totalScores);

    // Function to handle score update for each player
    const handleScoreUpdate = (player, score) => {
        setPlayerScores(prevScores => ({
            ...prevScores,
            [player]: score
        }));
    };





    // Function to calculate total scores for each player
    const handleTotalScore = () => {
        let updatedTotalScores = {};
        for (const player in playerScores) {
            if (playerScores.hasOwnProperty(player)) {
                updatedTotalScores[player] = playerScores[player] + (totalScores[player] || 0);
            }
        }
        setTotalScores(updatedTotalScores);
    };

    // Function to calculate points based on the score submitted
    const handleTotalPoints = (score, points) => {
        if (score === 1) {
            points += 1; // Bogey
        } else if (score === 0) {
            points += 2; // Par
        } else if (score === -1) {
            points += 3; // Birdie
        } else if (score === -2) {
            points += 4; // Eagle
        }
        return points;
    };



    // useEffect to fetch user data from the server
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((error) => console.log(error));
    }, []);

    // useEffect to get stored scores from session storage
    useEffect(() => {
        const storedScores = sessionStorage.getItem('submittedScores');
        if (storedScores) {
            setTotalScores(JSON.parse(storedScores));
        }
    }, []);

    // Define handleWinners function before it's being used
    const handleWinners = () => {
        const maxPoints = Math.max(...calculatedPoints.map((player) => player.points));
        const playersWon = calculatedPoints.filter(player => player.points === maxPoints);
        const earnings = Math.floor(bettingAmount / playersWon.length)


        return { winners: playersWon, payout: earnings }
    };

    const executePayouts = async (gameResult) => {
        try {
            await axios.post(`http://localhost:8000/api/execute-payouts`, gameResult);
            // This URL should be replaced with the endpoint in your backend that handles payouts
        } catch (error) {
            console.error(`Error while executing payouts: ${error}`);
        }
    };




    const submitHandler = async (e) => {
        e.preventDefault();

        // Calculate points for each player based on their total scores
        const updatedCalculatedPoints = calculatedPoints.map((playerObj) => {
            const playerName = playerObj.player;
            const currPoints = playerObj.points;
            const newPoints = handleTotalPoints(playerScores[playerObj.player], playerObj.points);

            return {
                player: playerName,
                points: newPoints
            }
        });

        // Update the current hole number
        setCurrentHoleNumber(currentHoleNumber => currentHoleNumber + 1);

        // Execute the function to calculate total scores
        handleTotalScore();

        // Update the calculated points
        setCalculatedPoints(updatedCalculatedPoints);

        // Store the submitted scores in session storage
        sessionStorage.setItem('submittedScores', JSON.stringify(totalScores));

        setPlayerScores({
            [user.username]: 0,
            [players[1]]: 0,
            [players[2]]: 0,
            [players[3]]: 0
        });
        // Check if it's the last hole (hole 18) and set isSubmitted to true
        if (currentHoleNumber >= 18) {
            setIsSubmitted(true);

            const gameResult = handleWinners();

            // Await here to make sure the payouts are executed before moving to next lines
            await executePayouts(gameResult);
            // Now we should save round data since the payouts have been calculated and sent
        }
    }


    useEffect(() => {
        const storedBettingAmount = localStorage.getItem('bettingAmount');
        if (storedBettingAmount) {
            setBettingAmount(parseInt(JSON.parse(storedBettingAmount)) * (players.length - 1));
        }
    }, []);


    const saveRoundData = async () => {
        try {
            // Create Object to save rounds
            const roundData = {
                players: calculatedPoints.map(player => ({
                    name: player.player,
                    score: totalScores[player.player],
                    points: player.points,
                })),
                winners: handleWinners().winners.map(player => player.player),
                payout: handleWinners().payout,
                amountBet: bettingAmount,
                game: gamePicked,
                coursePicked: coursePicked,
            };
            // // Create payout data object
            const payoutData = {
                userId: user.id,  // The ID of the user who won
                amount: handleWinners().payout // The amount to pay out
            }
            // console.log(roundData);
            // Make a POST request to the backend to save the round data
            await axios.post('http://localhost:8000/api/rounds/new', roundData);
            navigate("/home");


        } catch (error) {
            console.log('Error saving round data:', error);
            // Handle any errors that might occur during the API call
            // ...
        }
    };






    return (
        <main>
            {!isSubmitted ?
                <section>
                    <div>
                        <h1 className="HoleNumber">Hole #{currentHoleNumber}</h1>
                    </div>
                    <table className="table" style={{ border: "solid black", margin: "20px auto", width: "1200px" }} >
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>Player</th>
                                <th style={{ width: '15%' }}>Score</th>
                                <th style={{ width: '70%' }}>Record Score</th>
                            </tr>
                        </thead>
                        {/* <tbody>
                            {
                                players.map((player) => {
                                    return (
                                        <tr>
                                            <td>{player.username}</td>
                                            <td>{playerScores[user.username]}</td>
                                            <td>
                                                <div className="d-flex justify-content-between">
                                                    <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(user.username, -2)} disabled={!isCreator}>Eagle</button>
                                                    <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(user.username, -1)} disabled={!isCreator}>Birdie</button>
                                                    <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(user.username, 0)} disabled={!isCreator}>Par</button>
                                                    <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(user.username, 1)} disabled={!isCreator}>Bogie</button>
                                                    <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(user.username, 2)} disabled={!isCreator}>Double Bogey</button>
                                                    <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(user.username, 10)} disabled={!isCreator}>X</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody> */}
                        <tbody>
                            <tr>
                                <td>{players[0] ? players[0].username : 'Loading...'}</td>
                                <td>{playerScores[user.username]}</td>
                                <td>
                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(user.username, -2)} disabled={isCreator === false}>Eagle</button>
                                        <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(user.username, -1)} disabled={isCreator === false}>Birdie</button>
                                        <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(user.username, 0)} disabled={isCreator === false}>Par</button>
                                        <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(user.username, 1)} disabled={isCreator === false}>Bogie</button>
                                        <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(user.username, 2)} disabled={isCreator === false}>Double Bogey</button>
                                        <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(user.username, 10)} disabled={isCreator === false}>X</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>{players[1] ? players[1].username : 'Loading...'}</td>
                                <td>{playerScores[players[1]]}</td>
                                <td>
                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(players[1], -2)} disabled={!isCreator}>Eagle</button>
                                        <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(players[1], -1)} disabled={!isCreator}>Birdie</button>
                                        <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(players[1], 0)} disabled={!isCreator}>Par</button>
                                        <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(players[1], 1)} disabled={!isCreator}>Bogie</button>
                                        <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(players[1], 2)} disabled={!isCreator}>Double Bogey</button>
                                        <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(players[1], 10)} disabled={!isCreator}>X</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>{players[2] ? players[2].username : 'Loading...'}</td>
                                <td>{playerScores[players[2]]}</td>
                                <td>
                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(players[2], -2)} disabled={!isCreator}>Eagle</button>
                                        <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(players[2], -1)} disabled={!isCreator}>Birdie</button>
                                        <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(players[2], 0)} disabled={!isCreator}>Par</button>
                                        <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(players[2], 1)} disabled={!isCreator}>Bogie</button>
                                        <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(players[2], 2)} disabled={!isCreator}>Double Bogey</button>
                                        <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(players[2], 10)} disabled={!isCreator}>X</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>{players[3] ? players[3].username : 'Loading...'}</td>
                                <td>{playerScores[players[3]]}</td>
                                <td>
                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(players[3], -2)} disabled={!isCreator}>Eagle</button>
                                        <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(players[3], -1)} disabled={!isCreator}>Birdie</button>
                                        <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(players[3], 0)} disabled={!isCreator}>Par</button>
                                        <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(players[3], 1)} disabled={!isCreator}>Bogie</button>
                                        <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(players[3], 2)} disabled={!isCreator}>Double Bogey</button>
                                        <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(players[3], 10)} disabled={!isCreator}>X</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="row justify-content-center">
                        <div className="col-6 text-center">

                            <button style={{ margin: "20px" }} type="submit" onClick={submitHandler} className="btn btn-success" disabled={!isCreator}>Submit Score</button>
                        </div>
                    </div>
                    <div className="container" style={{ marginLeft: "600px" }} >
                        <div className="row justify-content-center">
                            <div className="col-md-4">
                                <h1>ScoreCard</h1>
                                <table className="table" style={{ border: "solid black" }}>
                                    <thead>
                                        <tr>
                                            <th>Player</th>
                                            <th id="totalScore">Score</th>
                                            <th>Points</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{players[0].username}</td>
                                            <td>{scoreUpdating[0]}</td>
                                            <td>{calculatedPoints[0].points}</td>

                                        </tr>

                                        <tr>
                                            <td>{players[1] ? players[1].username : 'Loading...'}</td>
                                            <td>{scoreUpdating[1]}</td>
                                            <td>{calculatedPoints[1].points}</td>
                                        </tr>
                                        <tr>
                                            <td>{players[2] ? players[2].username : 'Loading...'}</td>
                                            <td>{scoreUpdating[2]}</td>
                                            <td>{calculatedPoints[2].points}</td>
                                        </tr>
                                        <tr>
                                            <td>{players[3] ? players[3].username : 'Loading...'}</td>
                                            <td>{scoreUpdating[3]}</td>
                                            <td>{calculatedPoints[3].points}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <Chat />
                    </div>

                </section>

                :

                <div className="container mt-4">
                    <h2>Round Totals</h2>
                    <table className="table table-bordered">
                        <thead>
                            <tr>

                                <th>Players</th>
                                <th>Total Score</th>
                                <th>Total Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.username}</td>
                                <td>{totalScores[players[0]]}</td>
                                <td>{calculatedPoints[0].points}</td>
                            </tr>
                            <tr>
                                <td>{players[1]}</td>
                                <td>{totalScores[players[1]]}</td>
                                <td>{calculatedPoints[1].points}</td>

                            </tr>
                            <tr>
                                <td>{players[2]}</td>
                                <td>{totalScores[players[2]]}</td>
                                <td>{calculatedPoints[2].points}</td>
                            </tr>
                            <tr>
                                <td>{players[3]}</td>
                                <td>{totalScores[players[3]]}</td>
                                <td>{calculatedPoints[3].points}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ textAlign: "center" }} >
                        {handleWinners().length === 1 ? (

                            <h3 colSpan="4">Winner: {handleWinners().winners[0]}</h3>

                        ) : (

                            <h3 style={{ color: "red" }} colSpan="4">Winners: {handleWinners().winners.map(player => player.player).join(", ")} won ${handleWinners().payout}</h3>
                        )}
                        <button className="btn btn-primary" onClick={saveRoundData}>
                            Save Round
                        </button>
                    </div>


                </div>

            }
            <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                Home
            </Link>
        </main >

    )

};
export default ScoreCard;





    // ============================================================================
    // Function to handle form submission
    // const submitHandler = async (e) => {
    //     e.preventDefault();

    //     // Execute the function to calculate total scores
    //     handleTotalScore();

    //     // Calculate points for each player based on their total scores
    //     const updatedCalculatedPoints = calculatedPoints.map((playerObj) => {
    //         const playerName = playerObj.player;
    //         const currPoints = playerObj.points;
    //         const newPoints = handleTotalPoints(playerScores[playerObj.player], playerObj.points);

    //         return {
    //             player: playerName,
    //             points: newPoints
    //         }
    //     });

    //     // Update the current hole number
    //     setCurrentHoleNumber(currentHoleNumber => currentHoleNumber + 1);

    //     // Update the calculated points
    //     setCalculatedPoints(updatedCalculatedPoints);

    //     // Store the submitted scores in session storage
    //     sessionStorage.setItem('submittedScores', JSON.stringify(totalScores));

    //     // Reset the player scores for the next round
    //     setPlayerScores({
    //         [user.username]: 0,
    //         [players[1]]: 0,
    //         [players[2]]: 0,
    //         [players[3]]: 0
    //     });

    //     // Check if it's the last hole (hole 18) and set isSubmitted to true
    //     if (currentHoleNumber >= 18) {
    //         setIsSubmitted(true);

    //         const gameResult = handleWinners();

    //         // Await here to make sure the payouts are executed before moving to next lines
    //         await executePayouts(gameResult);
    //         // Now we should save round data since the payouts have been calculated and sent
    //         await saveRoundData();
    //     };

    //     const executePayouts = async (gameResult) => {
    //         try {
    //             await axios.post(`http://localhost:8000/api/execute-payouts`, gameResult);
    //             // This URL should be replaced with the endpoint in your backend that handles payouts
    //         } catch (error) {
    //             console.error(`Error while executing payouts: ${error}`);
    //         }
    //     };

    //     const handleWinners = () => {
    //         const maxPoints = Math.max(...calculatedPoints.map((player) => player.points));
    //         const playersWon = calculatedPoints.filter(player => player.points === maxPoints);
    //         const earnings = Math.floor(bettingAmount / playersWon.length)

    //         return { winners: playersWon, payout: earnings }
    //     };

    //     // Extracting the scores from the totalScores object as an array




    //     const maxPoints = Math.max(...calculatedPoints.map((player) => player.points)); //this will return a winner
    //     // const winners = [];

    //     // for (const player of calculatedPoints) {
    //     //     if (player.points === maxPoints) {
    //     //         winners.push(player.player); //if there is a tie, we add to the winners which is good

    //     //     }
    //     // }
    //     const playersWon = calculatedPoints.filter(player => player.points === maxPoints);
    //     // console.log(playersWon);
    //     //setWinners((prev) => ([...prev, playersWon]));
    //     const earnings = Math.floor(bettingAmount / playersWon.length)
    //     // setWinners(playersWon)
    //     return { winners: playersWon, payout: earnings }//{ winners: [], payout: int}

