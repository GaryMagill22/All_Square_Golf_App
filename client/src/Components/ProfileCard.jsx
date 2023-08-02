import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';


const ProfileCard = () => {
    return (
        <div>
            <section className="vh-100" style={{ backgroundColor: '#eee' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-12 col-xl-4">
                            <div className="card" style={{ borderRadius: '15px' }}>
                                <div className="card-body text-center">
                                    <div className="mt-3 mb-4">


                                        <img
                                            src=""
                                            alt="logo"
                                            style={{ width: '100px' }}
                                        />
                                    </div>
                                    <h4 className="mb-2">Gary Magill</h4>
                                    <p className="text-muted mb-4">
                                        <a><span className="mx-2">|</span>garymagill22@gmail.com</a>
                                    </p>
                                    <div className="mb-4 pb-2">
                                        <p>Handicap: 7.4</p>
                                        <p>Payments | PayPal, Venmo, AppleCash </p>
                                        <p>Righty <span>|</span> Lefty</p>
                                        <p>Home Course</p>
                                        <p>Omni Interlocken Golf Club, Superior Colorado</p>
                                    </div>
                                    <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                        <div>
                                            <p className="mb-0">All Square Balance</p>
                                            <p className="mb-2 h5">$372</p>
                                        </div>
                                        <div className="px-3">
                                            <p className="mb-0">Games Won</p>
                                            <p className="mb-2 h5">14</p>
                                        </div>
                                        <div>
                                            <p className="mb-0">Total Rounds Played</p>
                                            <p className="mb-2 h5">23</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                    Home
                </Link>
            </section>
        </div>
    );
};

export default ProfileCard;

// Old ScoreCard Component in case it broke.
// import axios from 'axios'; // Importing Axios for making HTTP requests
// import 'bootstrap/dist/css/bootstrap.css'; // Importing Bootstrap CSS for styling
// import React, { useEffect, useState } from 'react'; // Importing necessary React components
// import { useNavigate, Link } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom

// const ScoreCard = () => {
//     const navigate = useNavigate(); // Creating a navigation function using useNavigate
//     const [user, setUser] = useState([]); // State variable for the user data
//     const [bettingAmount, setBettingAmount] = useState(0); // State for how much money betting.
//     const [players, setPlayers] = useState(() => { // State variable for player data fetched from local storage
//         const data = localStorage.getItem('players');
//         return data ? JSON.parse(data) : []
//     });
//     const [playerScores, setPlayerScores] = useState({}); // State variable for player scores
//     const [calculatedPoints, setCalculatedPoints] = useState( // State variable for calculated points for each player
//         [
//             { player: players[0], points: 0 },
//             { player: players[1], points: 0 },
//             { player: players[2], points: 0 },
//             { player: players[3], points: 0 }
//         ]
//     );
//     const [currentHoleNumber, setCurrentHoleNumber] = useState(1); // State variable to keep track of the current hole number
//     const [isSubmitted, setIsSubmitted] = useState(false); // State variable to track if the score is submitted
//     const [totalScores, setTotalScores] = useState({}); // State variable for the total scores
//     const [winners, setWinners] = useState([])
//     // Function to handle score update for each player
//     const handleScoreUpdate = (player, score) => {
//         setPlayerScores(prevScores => ({
//             ...prevScores,
//             [player]: score
//         }));
//     };

//     // Function to calculate total scores for each player
//     const handleTotalScore = () => {
//         let updatedTotalScores = {};
//         for (const player in playerScores) {
//             if (playerScores.hasOwnProperty(player)) {
//                 updatedTotalScores[player] = playerScores[player] + (totalScores[player] || 0);
//             }
//         }
//         setTotalScores(updatedTotalScores);
//     };

//     // Function to calculate points based on the score submitted
//     const handleTotalPoints = (score, points) => {
//         if (score === 1) {
//             points += 1; // Bogey
//         } else if (score === 0) {
//             points += 2; // Par
//         } else if (score === -1) {
//             points += 3; // Birdie
//         } else if (score === -2) {
//             points += 4; // Eagle
//         }
//         return points;
//     };



//     // useEffect to fetch user data from the server
//     useEffect(() => {
//         axios
//             .get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
//             .then((res) => setUser(res.data))
//             .catch((error) => console.log(error));
//     }, []);

//     // useEffect to get stored scores from session storage
//     useEffect(() => {
//         const storedScores = sessionStorage.getItem('submittedScores');
//         if (storedScores) {
//             setTotalScores(JSON.parse(storedScores));
//         }
//     }, []);

//     // Function to handle form submission
//     const submitHandler = (e) => {
//         e.preventDefault();

//         // Execute the function to calculate total scores
//         handleTotalScore();

//         // Calculate points for each player based on their total scores
//         const updatedCalculatedPoints = calculatedPoints.map((playerObj) => {
//             const playerName = playerObj.player;
//             const currPoints = playerObj.points;
//             const newPoints = handleTotalPoints(playerScores[playerObj.player], playerObj.points);

//             return {
//                 player: playerName,
//                 points: newPoints
//             }
//         });

//         // Update the current hole number
//         setCurrentHoleNumber(currentHoleNumber => currentHoleNumber + 1);

//         // Update the calculated points
//         setCalculatedPoints(updatedCalculatedPoints);

//         // Store the submitted scores in session storage
//         sessionStorage.setItem('submittedScores', JSON.stringify(totalScores));

//         // Reset the player scores for the next round
//         setPlayerScores({
//             [user.username]: 0,
//             [players[1]]: 0,
//             [players[2]]: 0,
//             [players[3]]: 0
//         });

//         // Check if it's the last hole (hole 18) and set isSubmitted to true
//         if (currentHoleNumber >= 18) {
//             setIsSubmitted(true);
//             // handleWinners()
//         }
//     };

//     // Extracting the scores from the totalScores object as an array
//     const scoreUpdating = Object.values(totalScores);

//     const handleWinners = () => {



//         const maxPoints = Math.max(...calculatedPoints.map((player) => player.points)); //this will return a winner
//         // const winners = [];

//         // for (const player of calculatedPoints) {
//         //     if (player.points === maxPoints) {
//         //         winners.push(player.player); //if there is a tie, we add to the winners which is good

//         //     }
//         // }
//         const playersWon = calculatedPoints.filter(player => player.points === maxPoints);
//         console.log(playersWon);
//         //setWinners((prev) => ([...prev, playersWon]));
//         // setWinners(playersWon)
//         //return playersWon


//     };





//     return (
//         <main>
//             {!isSubmitted ?
//                 <section>
//                     <div>
//                         <h1 className="HoleNumber">Hole #{currentHoleNumber}</h1>
//                     </div>
//                     <table className="table" style={{ border: "solid black", margin: "20px auto", width: "1200px" }} >
//                         <thead>
//                             <tr>
//                                 <th style={{ width: '15%' }}>Player</th>
//                                 <th style={{ width: '15%' }}>Score</th>
//                                 <th style={{ width: '70%' }}>Record Score</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>{user.username}</td>
//                                 <td>{playerScores[user.username]}</td>
//                                 <td>
//                                     <div className="d-flex justify-content-between">
//                                         <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(user.username, -2)}>Eagle</button>
//                                         <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(user.username, -1)}>Birdie</button>
//                                         <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(user.username, 0)}>Par</button>
//                                         <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(user.username, 1)}>Bogie</button>
//                                         <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(user.username, 2)}>Double Bogey</button>
//                                         <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(user.username, 10)}>X</button>
//                                     </div>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>{players[1]}</td>
//                                 <td>{playerScores[players[1]]}</td>
//                                 <td>
//                                     <div className="d-flex justify-content-between">
//                                         <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(players[1], -2)}>Eagle</button>
//                                         <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(players[1], -1)}>Birdie</button>
//                                         <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(players[1], 0)}>Par</button>
//                                         <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(players[1], 1)}>Bogie</button>
//                                         <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(players[1], 2)}>Double Bogey</button>
//                                         <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(players[1], 10)}>X</button>
//                                     </div>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>{players[2]}</td>
//                                 <td>{playerScores[players[2]]}</td>
//                                 <td>
//                                     <div className="d-flex justify-content-between">
//                                         <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(players[2], -2)}>Eagle</button>
//                                         <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(players[2], -1)}>Birdie</button>
//                                         <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(players[2], 0)}>Par</button>
//                                         <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(players[2], 1)}>Bogie</button>
//                                         <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(players[2], 2)}>Double Bogey</button>
//                                         <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(players[2], 10)}>X</button>
//                                     </div>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>{players[3]}</td>
//                                 <td>{playerScores[players[3]]}</td>
//                                 <td>
//                                     <div className="d-flex justify-content-between">
//                                         <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(players[3], -2)}>Eagle</button>
//                                         <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(players[3], -1)}>Birdie</button>
//                                         <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(players[3], 0)}>Par</button>
//                                         <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(players[3], 1)}>Bogie</button>
//                                         <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(players[3], 2)}>Double Bogey</button>
//                                         <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(players[3], 10)}>X</button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                     <div className="row justify-content-center">
//                         <div className="col-6 text-center">

//                             {currentHoleNumber === 18 ? <button style={{ margin: "20px" }} type="submit" onClick={submitHandler} className="btn btn-success">Submit Score</button> :
//                                 <button style={{ margin: "20px" }} type="submit" onClick={submitHandler} className="btn btn-success">Submit Score</button>}
//                         </div>
//                     </div>
//                     <div className="container">
//                         <div className="row justify-content-center">
//                             <div className="col-6">
//                                 <h1>ScoreCard</h1>
//                                 <table className="table" style={{ border: "solid black" }}>
//                                     <thead>
//                                         <tr>
//                                             <th>Player</th>
//                                             <th id="totalScore">Score</th>
//                                             <th>Points</th>

//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td>{user.username}</td>
//                                             <td>{scoreUpdating[0]}</td>
//                                             <td>{calculatedPoints[0].points}</td>

//                                         </tr>

//                                         <tr>
//                                             <td>{players[1]}</td>
//                                             <td>{scoreUpdating[1]}</td>
//                                             <td>{calculatedPoints[1].points}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>{players[2]}</td>
//                                             <td>{scoreUpdating[2]}</td>
//                                             <td>{calculatedPoints[2].points}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>{players[3]}</td>
//                                             <td>{scoreUpdating[3]}</td>
//                                             <td>{calculatedPoints[3].points}</td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//                 :

//                 <div className="container mt-4">
//                     <h2>Round Totals</h2>
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>

//                                 <th>Players</th>
//                                 <th>Total Score</th>
//                                 <th>Total Points</th>
//                                 <th>Total Money Earned</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>{user.username}</td>
//                                 <td>{totalScores[players[0]]}</td>
//                                 <td>{calculatedPoints[0].points}</td>
//                                 <td></td>
//                             </tr>
//                             <tr>
//                                 <td>{players[1]}</td>
//                                 <td>{totalScores[players[1]]}</td>
//                                 <td>{calculatedPoints[1].points}</td>
//                                 <td></td>
//                             </tr>
//                             <tr>
//                                 <td>{players[2]}</td>
//                                 <td>{totalScores[players[2]]}</td>
//                                 <td>{calculatedPoints[2].points}</td>
//                                 <td></td>
//                             </tr>
//                             <tr>
//                                 <td>{players[3]}</td>
//                                 <td>{totalScores[players[3]]}</td>
//                                 <td>{calculatedPoints[3].points}</td>
//                                 <td></td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             }
//             <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
//                 Home
//             </Link>
//         </main>

//     )
// };

// export default ScoreCard;