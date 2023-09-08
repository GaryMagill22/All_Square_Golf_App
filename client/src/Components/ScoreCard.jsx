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
    const [earningsPerWinner, setEarningsPerWinner] = useState(0); // set state for earnings 


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



    // const handleWinners = () => {
    //     // Step 1: Find max points
    //     const maxPoints = Math.max(...scorePoints.map((player) => player.point));

    //     // Get betting amount
    //     const storedBettingAmount = parseInt(localStorage.getItem('bettingAmount')) || 0;

    //     // Step 2: Calculate total pool
    //     const totalPool = storedBettingAmount * scorePoints.length;



    //     let winnersCount = 0;
    //     for (const player of scorePoints) {
    //         if (player.point === maxPoints) {
    //             if (!player.user) {
    //                 console.error("Found player with undefined username:", player);
    //             }
    //             winnersList.push({ player: player.user, points: player.point });
    //             winnersCount++;
    //         }
    //     }
    //     // Step 3: Calculate potential earnings total pool minus users betting amount
    //     const potentialEarnings = totalPool - storedBettingAmount;

    //     // Step 4: Calculate earnings per winner
    //     const earningsPerWinner = Math.floor(totalPool / winnersCount);

    //     // Update payout for each winner
    //     const playersWithPayout = scorePoints.map(player => {
    //         if (player.point === maxPoints) {
    //             return { ...player, payout: earningsPerWinner };
    //         }
    //         setEarnings(earningsPerWinner);

    //         return earningsPerWinner;
    //     });


    //     setWinners(playersWithPayout);

    //     return winnersList;
    // };

    const handleWinners = () => {
        // Step 1: Find max points
        const maxPoints = Math.max(...scorePoints.map((player) => player.point));

        // Get betting amount
        const storedBettingAmount = parseInt(localStorage.getItem('bettingAmount')) || 0;

        // Step 2: Calculate total pool
        const totalPool = storedBettingAmount * scorePoints.length;

        // Reset winners list
        winnersList.length = 0;

        let winnersCount = 0;
        for (const player of scorePoints) {
            if (player.point === maxPoints) {
                if (!player.user) {
                    console.error("Found player with undefined username:", player);
                }
                winnersList.push({ player: player.user, points: player.point });
                winnersCount++;
            }
        }

        let earningsPerWinner;
        if (winnersCount === 1) {
            earningsPerWinner = totalPool - storedBettingAmount;
        } else {
            earningsPerWinner = Math.floor(totalPool / winnersCount);
        }

        // Update payout for each winner
        const playersWithPayout = scorePoints.map(player => {
            if (player.point === maxPoints) {
                return { ...player, payout: earningsPerWinner };
            }
            return player;
        });

        setEarnings(earningsPerWinner);
        setWinners(playersWithPayout);

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
                    <div style={{ textAlign: "center", color: "purple" }}>
                        {Array.isArray(winnersList) && winnersList.length === 1 ? (
                            <h3 colSpan="4">Winner: {winnersList[0].player} won ${earnings}</h3>
                        ) : (
                            <h3 style={{ textAlign: "center", color: "purple" }} colSpan="4">
                                Winners: {winnersList.map(winner => winner.player).join(", ")} each won ${earnings}
                            </h3>
                        )}
                        <button className="btn btn-primary">
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

