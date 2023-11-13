import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Chat from './Chat';
import { getSocket } from '../helpers/socketHelper';
import { Axios } from '../helpers/axiosHelper';

const ScoreCard = () => {
    const socket = getSocket();
    const navigate = useNavigate();
    const { gameType } = useParams();

    // State values
    const [user, setUser] = useState([]);
    const [players, setPlayers] = useState(() => {
        let storedData;
        if (gameType === 'team') {
            const storedTeams = localStorage.getItem('teams');
            if (storedTeams) {
                const teams = JSON.parse(storedTeams);
                const extractedPlayers = teams.flatMap(team =>
                    team.players.map(player => ({
                        _id: player.id,
                        username: player.name
                    }))
                );
                storedData = extractedPlayers;
            } else {
                storedData = [];
            }
        } else {
            storedData = JSON.parse(localStorage.getItem('players'));
            if (!storedData) {
                storedData = [];
            }
        }

        return storedData;
    });
    const [isCreator, setIsCreator] = useState(JSON.parse(localStorage.getItem('creator')));
    const [isLoading, setIsLoading] = useState(false);
    const [scorePoints, setScorePoints] = useState([]);
    const [teamPoints, setTeamPoints] = useState([]);
    const [calculatedPoints, setCalculatedPoints] = useState(
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
    const [teams, setTeams] = useState(JSON.parse(localStorage.getItem('teams')));
    const [selectedPlayer, setSelectedPlayer] = useState(Object.fromEntries(players.map(player => [player.username, { score: 0, point: 0 }])));
    const scoreUpdating = Object.values(totalScores);
    const selectedGame = useState(JSON.parse(localStorage.getItem('user_selected_game')));
    const [isPlayerRecordChosen, setIsPlayerRecordChosen] = useState(false);

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

        if (selectedGame[0] === 'match play') {
            setIsPlayerRecordChosen(true);
        }
    };

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

            // Make a POST request to the backend to save the round data
            await axios.post('http://localhost:8000/api/rounds/new', roundData);
            navigate("/home");
        } catch (error) {
            console.log('Error saving round data:', error);
        }
    };

    const findSmallestScoreForEachTeam = (players, teams) => {
        // Initialize the teamScores object with the maximum possible score as a starting point
        const teamScores = {};
        teams.forEach((team) => {
            teamScores[team.teamName] = {
                player: null,
                score: Number.MAX_VALUE,
            };
        });

        // Iterate through the players and update teamScores with the smallest score for each team
        for (const playerName in players) {
            const player = players[playerName];
            const playerScore = player.score;
            const playerPoint = player.point;

            teams.forEach((team) => {
                if (team.players.find((p) => p.name === playerName)) {
                    if (playerScore < teamScores[team.teamName].score) {
                        teamScores[team.teamName] = {
                            score: playerScore,
                            point: playerPoint,
                        };
                    }
                }
            });
        }

        return teamScores;
    }

    const submitScore = async (event) => {
        event.preventDefault();
        let updatedScorePoints;
        if (gameType === 'individual') {
            if (selectedGame[0] === 'stableford') {
                updatedScorePoints = scorePoints.map(scorePoint => ({
                    ...scorePoint,
                    score: scorePoint.score + selectedPlayer[scorePoint.user].score,
                    point: scorePoint.point + selectedPlayer[scorePoint.user].point
                }));

                setScorePoints(updatedScorePoints);
                socket.emit('holeNumber', currentHoleNumber);
                socket.emit('points', updatedScorePoints);
            } else {
                if (isPlayerRecordChosen) {
                    const lowestScore = Math.min(...Object.values(selectedPlayer).map(player => player.score));
                    const numberOfLowScorers = Object.values(selectedPlayer).filter(player => player.score === lowestScore).length;
                    const pointsToAdd = numberOfLowScorers === 1 ? 1 : 0.5;

                    // Update the scorePoints array
                    const updatedScorePoints = scorePoints.map(scorePoint => {
                        const player = selectedPlayer[scorePoint.user];
                        const isLowestScore = player.score === lowestScore;

                        return {
                            ...scorePoint,
                            score: scorePoint.score + player.score,
                            point: scorePoint.point + (isLowestScore ? pointsToAdd : 0)
                        };
                    });

                    setScorePoints(updatedScorePoints);
                    setIsPlayerRecordChosen(false);
                    socket.emit('holeNumber', currentHoleNumber);
                    socket.emit('points', updatedScorePoints);
                }
            }
        }

        if (gameType === 'team') {
            const result = findSmallestScoreForEachTeam(selectedPlayer, teams);
            if (selectedGame[0] === 'stableford') {
                updatedScorePoints = teamPoints.map(teamPoint => ({
                    ...teamPoint,
                    score: teamPoint.score + result[teamPoint.team].score,
                    point: teamPoint.point + result[teamPoint.team].point
                }));

                setTeamPoints(updatedScorePoints);
                socket.emit('holeNumber', currentHoleNumber);
                socket.emit('points', updatedScorePoints);
            } else {
                if (isPlayerRecordChosen) {
                    const lowestScore = Math.min(...Object.values(selectedPlayer).map(player => player.score));
                    const numberOfLowScorers = Object.values(selectedPlayer).filter(player => player.score === lowestScore).length;
                    const pointsToAdd = numberOfLowScorers === 1 ? 1 : 0.5;

                    // Update the scorePoints array
                    const updatedScorePoints = teamPoints.map(teamPoint => {
                        const player = result[teamPoint.team];
                        const isLowestScore = player.score === lowestScore;

                        return {
                            ...teamPoint,
                            score: teamPoint.score + player.score,
                            point: teamPoint.point + (isLowestScore ? pointsToAdd : 0)
                        };
                    });

                    setTeamPoints(updatedScorePoints);
                    setIsPlayerRecordChosen(false);
                    socket.emit('holeNumber', currentHoleNumber);
                    socket.emit('points', updatedScorePoints);
                }
            }
        }

        const updatedPlayers = Object.fromEntries(players.map(player => [player.username, { score: 0, point: 0 }]))
        setSelectedPlayer(updatedPlayers);
        setCurrentHoleNumber(currentHoleNumber => currentHoleNumber + 1);

        // Store the submitted scores in session storage
        sessionStorage.setItem('updatedScorePoints', JSON.stringify(totalScores));
        if (currentHoleNumber >= 18) {
            socket.emit('gameCompleted')
            handleWinners();
            teamWinnerCalculation();
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

        if (gameType === 'team') {
            const teamScoreValues = teams.map((team) => (
                {
                    team: team.teamName,
                    score: 0,
                    point: 0
                }
            ))
            setTeamPoints(teamScoreValues);
        }
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

    const teamWinnerCalculation = () => {
        if (teamPoints.length === 0) {
            return null;
        }

        return teamPoints.reduce((maxPointElement, currentElement) => {
            if (currentElement.point > maxPointElement.point) {
                return currentElement;
            } else {
                return maxPointElement;
            }
        }, teamPoints[0]);
    }

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

        if (gameType === 'team') {
            // Get the team who won the game
            const gameWinner = teamWinnerCalculation();
            const retrievedWinners = teams.filter((item) => item.teamName === gameWinner.team);
            const teamWinnerList = retrievedWinners[0].players.map(item => ({
                players: item.name,
                point: gameWinner.point
            }));
            setWinnersList(teamWinnerList)
        }
        socket.emit('winnersList', [winnersList, earningsPerWinner, localStorage.getItem('lobby')]);

        return winnersList;
    };

    const handleScoreCardSigning = async () => {
        const lobby = localStorage.getItem('lobby');
        setIsLoading(true);
        try {
            const response = await Axios({
                url: `/games/signscorecard/${lobby}`,
                method: 'patch',
            });

            setIsLoading(false);
            if (!response.status) {
                alert(response.message);
                return;
            }

            alert(response.message);
            socket.emit('checkScoreCard', lobby);
            return;
        } catch (err) {
            alert('Unable to sign scorecard');
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('holeNumberReceived', (data) => {
                setCurrentHoleNumber(data);
            });

            socket.on('pointsReceived', (data) => {
                gameType === 'individual' ? setScorePoints(data) : setTeamPoints(data);
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

            socket.on('winnersListReceived', (data) => {
                setWinnersList(data[0]);
                setEarnings(data[1]);
                localStorage.removeItem('players');
                localStorage.setItem('players', localStorage.getItem('user_id'));
            });

            socket.on('payoutIsConfirmedByAllParticipants', () => {
                const lobby = localStorage.getItem('lobby');
                socket.emit('payWinners', { lobby, winners: winnersList, amount: earnings });
                alert('All users has signed scorecard. Payout will be sent to winners shortly');
            });

        }
    }, [socket])

    return (
        <main>
            {!isSubmitted ?
                <section>
                    <div>
                        <h6>Game Selected: {selectedGame[0]}, Game type: {gameType}</h6>
                        <h1 className="HoleNumber">Hole #{currentHoleNumber}</h1>
                    </div>
                    {
                        gameType === 'individual' && <table className="table" style={{ border: "solid black", margin: "20px auto", maxWidth: "800px" }} >
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
                                                        <button type="button" className="btn btn-primary btn-sm" value={-2} onClick={() => handleScoreUpdate(player.username, -2)} disabled={!isCreator}>Eagle</button>
                                                        <button type="button" className="btn btn-secondary btn-sm" value={-1} onClick={() => handleScoreUpdate(player.username, -1)} disabled={!isCreator}>Birdie</button>
                                                        <button type="button" className="btn btn-dark btn-sm" value={0} onClick={() => handleScoreUpdate(player.username, 0)} disabled={!isCreator}>Par</button>
                                                        <button type="button" className="btn btn-info btn-sm" value={1} onClick={() => handleScoreUpdate(player.username, 1)} disabled={!isCreator}>Bogie</button>
                                                        <button type="button" className="btn btn-warning btn-sm" value={2} onClick={() => handleScoreUpdate(player.username, 2)} disabled={!isCreator}>Double Bogey</button>
                                                        <button type="button" className="btn btn-danger btn-sm" value={10} onClick={() => handleScoreUpdate(player.username, 10)} disabled={!isCreator}>X</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    }
                    {
                        gameType === 'team' && teams.map((team) => {
                            return (
                                <div>
                                    <h4>{team.teamName}</h4>
                                    {
                                        team.players.map((player) => {
                                            return (
                                                <table className="table" style={{ border: "solid black", margin: "20px auto", maxWidth: "800px" }} >
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '15%' }}>Player</th>
                                                            <th style={{ width: '15%' }}>Score</th>
                                                            <th style={{ width: '70%' }}>Record Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{player.name}</td>
                                                            <td>{selectedPlayer[player.name].score}</td>
                                                            <td>
                                                                <div className="d-flex justify-content-between">
                                                                    <button type="button" className="btn btn-primary" value={-2} onClick={() => handleScoreUpdate(player.name, -2)} disabled={!isCreator}>Eagle</button>
                                                                    <button type="button" className="btn btn-secondary" value={-1} onClick={() => handleScoreUpdate(player.name, -1)} disabled={!isCreator}>Birdie</button>
                                                                    <button type="button" className="btn btn-dark" value={0} onClick={() => handleScoreUpdate(player.name, 0)} disabled={!isCreator}>Par</button>
                                                                    <button type="button" className="btn btn-info" value={1} onClick={() => handleScoreUpdate(player.name, 1)} disabled={!isCreator}>Bogie</button>
                                                                    <button type="button" className="btn btn-warning" value={2} onClick={() => handleScoreUpdate(player.name, 2)} disabled={!isCreator}>Double Bogey</button>
                                                                    <button type="button" className="btn btn-danger" value={10} onClick={() => handleScoreUpdate(player.name, 10)} disabled={!isCreator}>X</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                    <div className="row justify-content-center">
                        <div className="col-6 text-center">

                            <button style={{ margin: "20px" }} type="submit" onClick={(event) => submitScore(event)} className="btn btn-success" disabled={!isCreator}>Submit Score</button>
                        </div>
                    </div>
                    <div className="container"  >
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
                                            gameType === 'individual'
                                                ? scorePoints.map((player) => (
                                                    <tr key={player.user}>
                                                        <td>{player.user}</td>
                                                        <td>{player.score}</td>
                                                        <td>{player.point}</td>
                                                    </tr>
                                                ))
                                                : teamPoints.map((team) => (
                                                    <tr key={team.team}>
                                                        <td>{team.team}</td>
                                                        <td>{team.score}</td>
                                                        <td>{team.point}</td>
                                                    </tr>
                                                ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4>Betting Amount: ${bettingAmount}</h4>
                    </div>
                    <div>
                        {isCreator ? (
                            <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                                Home
                            </Link>
                        ) : (
                            <button className="btn btn-outline-primary btn-sm m-2" disabled>
                                Home
                            </button>
                        )}
                    </div>
                </section>

                :

                <div className="container mt-4">
                    <h2>Round Totals</h2>
                    <table className="table table-bordered">
                        <thead>
                            <tr>

                                <th>{gameType === 'individual' ? 'Players' : "Teams"}</th>
                                <th>Total Score</th>
                                <th>Total Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                gameType === 'individual'
                                    ? scorePoints.map((player) => (
                                        <tr key={player.user}>
                                            <td>{player.user}</td>
                                            <td>{player.score}</td>
                                            <td>{player.point}</td>
                                        </tr>
                                    ))
                                    : teamPoints.map((team) => (
                                        <tr key={team.team}>
                                            <td>{team.team}</td>
                                            <td>{team.score}</td>
                                            <td>{team.point}</td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                    <div style={{ textAlign: "center", color: "purple" }}>
                        {
                            gameType === 'individual'
                                ?
                                Array.isArray(winnersList) && winnersList.length === 1 ? (
                                    <h3 colSpan="4">Winner: {winnersList[0].player} won ${earnings}</h3>
                                ) : (
                                    <h3 style={{ textAlign: "center", color: "purple" }} colSpan="4">
                                        Winners: {winnersList.map(winner => winner.player).join(", ")} each won ${earnings}
                                    </h3>
                                )
                                :
                                <p>{teamWinnerCalculation().team} won. ${earnings} each will be shared across to every player</p>
                        }
                        <button className='btn btn-success mr-2' onClick={handleScoreCardSigning}>
                            {
                                isLoading && <span className='spinner-border spinner-border-sm mr-2' role='status' aria-hidden="true"></span>
                            }
                            Sign scorecard to confirm winner(s) payout
                        </button>
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