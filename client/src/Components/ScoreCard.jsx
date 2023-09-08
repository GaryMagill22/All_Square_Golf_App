import axios from 'axios'; // Importing Axios for making HTTP requests
import 'bootstrap/dist/css/bootstrap.css'; // Importing Bootstrap CSS for styling
import React, { useEffect, useState } from 'react'; // Importing necessary React components
import { useNavigate, Link } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom
import Chat from './Chat';
import { getSocket } from '../helpers/socketHelper';

const ScoreCard = () => {
    const socket = getSocket();
    const navigate = useNavigate(); // Creating a navigation function using useNavigate
    const [user, setUser] = useState([]); // State variable for the user data

    const [players, setPlayers] = useState(() => { // State variable for player data fetched from local storage
        const storedPlayers = localStorage.getItem('players');
        return storedPlayers ? JSON.parse(storedPlayers) : [];
    });
    const [isCreator, setIsCreator] = useState(JSON.parse(localStorage.getItem('creator')));


    const [scorePoints, setScorePoints] = useState([]);

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
    const [bettingAmount, setBettingAmount] = useState(); // State for how much money betting.
    const [gamePicked, setGamePicked] = useState();
    const [coursePicked, setCoursePicked] = useState('');
    const [winnersList, setWinnersList] = useState([]); // State variable to track winners
    const [earnings, setEarnings] = useState(0); // set state for earnings 


    const [roundData, setRoundData] = useState({});
    const [selectedPlayer, setSelectedPlayer] = useState(Object.fromEntries(players.map(player => [player.username, { score: 0, point: 0 }])))

    const scoreUpdating = Object.values(totalScores);

    // Function to handle score update for each player
    const handleScoreUpdate = (player, score) => {
        var points;
        if (score === 2) {
            points = 2; // Double Bogey
        } if (score === 1) {
            points = 1; // Bogey
        } else if (score === 0) {
            points = 2; // Par
        } else if (score === -1) {
            points = 3; // Birdie
        } else if (score === -2) {
            points = 4; // Eagle
        } else {
            points = 0;
        }

        setSelectedPlayer(prevData => ({
            ...prevData,
            [player]: {
                score,
                point: points
            }
        }));

        const playerToUpdate = selectedPlayer;
        playerToUpdate[player].score = score;
        playerToUpdate[player].point = points;
        socket.emit('scoreUpdate', currentHoleNumber);
        socket.emit('players', playerToUpdate);

    };





    // const saveRoundData = async () => {
    //     try {
    //         // Create Object to save rounds
    //         const roundData = {
    //             players: calculatedPoints.map(player => ({
    //                 name: player.player,
    //                 score: totalScores[player.player],
    //                 points: player.points,
    //             })),
    //             winners: handleWinners().winners.map(player => player.player),
    //             payout: handleWinners().payout,
    //             amountBet: bettingAmount,
    //             game: gamePicked,
    //             coursePicked: coursePicked,
    //         };
    //         // // Create payout data object
    //         const payoutData = {
    //             userId: user.id,  // The ID of the user who won
    //             amount: handleWinners().payout // The amount to pay out
    //         }
    //         // console.log(roundData);
    //         // Make a POST request to the backend to save the round data
    //         await axios.post('http://localhost:8000/api/rounds/new', roundData);
    //         navigate("/home");
    //     } catch (error) {
    //         console.log('Error saving round data:', error);
    //         // Handle any errors that might occur during the API call
    //         // ...
    //     }
    // };





    const submitScore = async () => {
        const updatedScorePoints = scorePoints.map(scorePoint => ({
            ...scorePoint,
            score: scorePoint.score + selectedPlayer[scorePoint.user].score,
            point: scorePoint.point + selectedPlayer[scorePoint.user].point
        }));

        setScorePoints(updatedScorePoints);
        const updatedPlayers = Object.fromEntries(players.map(player => [player.username, { score: 0, point: 0 }]))
        setSelectedPlayer(updatedPlayers);
        setCurrentHoleNumber(currentHoleNumber => currentHoleNumber + 1);


        // Store the submitted scores in session storage
        sessionStorage.setItem('updatedScorePoints', JSON.stringify(totalScores));


        socket.emit('holeNumber', currentHoleNumber);
        socket.emit('points', updatedScorePoints);

        if (currentHoleNumber >= 18) {
            socket.emit('gameCompleted')
            handleWinners();
        }

    }




    useEffect(() => {
        // Set initial scorepoints value of players
        const scoreValues = players.map((player) => (
            {
                user: player.username,
                score: 0,
                point: 0
            }
        ))
        setScorePoints(scoreValues);
    }, []);

    // useEffect to fetch user data from the server
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((error) => console.log(error));
    }, []);



    // useEffect to get stored betting Amount from local storage
    useEffect(() => {
        const storedBettingAmount = localStorage.getItem('bettingAmount');
        if (storedBettingAmount) {
            setBettingAmount(storedBettingAmount);
        }
    }, []);


    const handleWinners = () => {
        const maxPoints = Math.max(...scorePoints.map((player) => player.point)); //this will return user with max points.

        const storedBettingAmount = parseInt(localStorage.getItem('bettingAmount'));  // to handle NaN
        console.log("bettingAmount:", storedBettingAmount);



        for (const player of scorePoints) {
            if (player.point === maxPoints) {
                // Player obj from 'scorePoints' has property name 'user' instead of 'username'
                if (!player.user) {
                    console.error("Found player with undefined username:", player);
                }
                winnersList.push({ player: player.user, points: player.point });
            }
        }

        const earnings = Math.floor(storedBettingAmount / scorePoints.length);
        setEarnings(earnings);
        console.log("earnings:", earnings);
        console.log('winners list====>', winnersList);
        const playersWon = scorePoints.map(player => ({ ...player, payout: earnings }));
        setWinners(playersWon);
        console.log('players won:==', playersWon)
        console.log("Is scorePoints an array?", Array.isArray(scorePoints));

        return winnersList;
    };

    useEffect(() => {
        if (socket) {
            socket.on('holeNumberReceived', (data) => {
                setCurrentHoleNumber(data);
            });

            socket.on('pointsReceived', (data) => {
                setScorePoints(data);
            });

            socket.on('playersReceived', (data) => {
                setSelectedPlayer(data);
            });

            socket.on('scorePointsReceived', (data) => {
                setScorePoints(data);
            });

            socket.on('gameCompletedReceived', () => {
                setIsSubmitted(true);
            });

        }
    }, [socket])










    // const executePayouts = async (gameResult) => {
    //     try {
    //         await axios.post(`http://localhost:8000/api/execute-payouts`, gameResult);
    //         // This URL should be replaced with the endpoint in your backend that handles payouts
    //     } catch (error) {
    //         console.error(`Error while executing payouts: ${error}`);
    //     }
    // };






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
                        <tbody>
                            {
                                players.map((player) => {
                                    return (
                                        <tr>
                                            <td>{player.username}</td>
                                            <td>{selectedPlayer[player.username].score}</td>
                                            <td>
                                                <div className="d-flex justify-content-between">
                                                    <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(player.username, -2)} disabled={!isCreator}>Eagle</button>
                                                    <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(player.username, -1)} disabled={!isCreator}>Birdie</button>
                                                    <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(player.username, 0)} disabled={!isCreator}>Par</button>
                                                    <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(player.username, 1)} disabled={!isCreator}>Bogie</button>
                                                    <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(player.username, 2)} disabled={!isCreator}>Double Bogey</button>
                                                    <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(player.username, 10)} disabled={!isCreator}>X</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>

                    </table>
                    <div className="row justify-content-center">
                        <div className="col-6 text-center">

                            <button style={{ margin: "20px" }} type="submit" onClick={submitScore} className="btn btn-success" disabled={!isCreator}>Submit Score</button>
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
                                        {
                                            scorePoints.map((player) => {
                                                return (
                                                    <tr>
                                                        <td>{player.user}</td>
                                                        <td>{player.score}</td>
                                                        <td>{player.point}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div>
                        Betting Amount: ${bettingAmount}
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
                            {
                                scorePoints.map((player) => {
                                    return (
                                        <tr>
                                            <td>{player.user}</td>
                                            <td>{player.score}</td>
                                            <td>{player.point}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div style={{ textAlign: "center" }}>
                        {Array.isArray(winnersList) && winnersList.length === 1 ? (
                            <h3 colSpan="4">Winner: {winnersList[0].player} won ${earnings}</h3>
                        ) : (
                            <h3 style={{ color: "red" }} colSpan="4">
                                {Array.isArray(winnersList) && winnersList.length > 0 ?
                                    `Winners: ${winnersList.map(player => player.player).join(", ")} each won $${earnings}`
                                    : ""
                                }
                            </h3>
                        )}
                        <button className="btn btn-primary">
                            Save Round
                        </button>
                    </div>








                    {/* <div style={{ textAlign: "center" }} >
                        {Array.isArray(winnersList) && winnersList.length === 1 ? (
                            <h3 colSpan="4">Winner: {winnersList[0].player}</h3>
                        ) : (
                            <h3 style={{ color: "red" }} colSpan="4">Winners: {Array.isArray(winnersList) && winnersList.length > 0 ? winnersList.map(player => player.user).join(", ") + " won $" + winnersList[0].payout : ""}</h3>
                        )}
                        <button className="btn btn-primary" >
                            Save Round
                        </button>
                    </div> */}

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




    // const submitHandler = async (e) => {
    //     e.preventDefault();
    //     // Calculate points for each player based on their total scores
    //     const updatedCalculatedPoints = calculatedPoints.map((playerObj) => {
    //         const playerName = playerObj.player;
    //         console.log('player name', playerObj);
    //         const currPoints = playerObj.points;
    //         const newPoints = handleTotalPoints(playerScores[playerObj.player], playerObj.points);

    //         return {
    //             player: playerName,
    //             points: newPoints
    //         }
    //     });

    //     // Update the current hole number
    //     socket.emit('holeNumber', currentHoleNumber);
    //     //setCurrentHoleNumber(currentHoleNumber => currentHoleNumber + 1);

    //     // Execute the function to calculate total scores
    //     handleTotalScore();

    //     // Update the calculated points
    //     socket.emit('calcPoint', updatedCalculatedPoints);
    //     setCalculatedPoints(updatedCalculatedPoints);

    //     // Store the submitted scores in session storage
    //     sessionStorage.setItem('submittedScores', JSON.stringify(totalScores));

    //     setPlayerScores({
    //         [user.username]: 0,
    //         [players[1]]: 0,
    //         [players[2]]: 0,
    //         [players[3]]: 0
    //     });
    //     // Check if it's the last hole (hole 18) and set isSubmitted to true
    //     if (currentHoleNumber >= 18) {
    //         socket.emit('gameCompleted');
    //         setIsSubmitted(true);

    //         const gameResult = handleWinners();

    //         // Await here to make sure the payouts are executed before moving to next lines
    //         await executePayouts(gameResult);
    //         // Now we should save round data since the payouts have been calculated and sent
    //     }
    // }



