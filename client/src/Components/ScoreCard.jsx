import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { getSocket } from '../helpers/socketHelper';
import { Axios } from '../helpers/axiosHelper';
import { useAppContext } from '../helpers/context';

const ScoreCard = () => {
    const socket = getSocket();
    const navigate = useNavigate();
    const { gameType } = useParams();
    // State values
    const [user, setUser] = useState([]);
    const { userInputCourse } = useAppContext(); // Accessing userInputCourse from context


    // State variables for scorecard
    const [players, setPlayers] = useState(() => {
        let storedData;
        if (gameType === 'team') {
            const storedTeams = localStorage.getItem('teams');
            if (storedTeams) {
                const teams = JSON.parse(storedTeams);
                storedData = teams.flatMap(team =>
                    team.players.map(player => ({
                        username: player.name, // Only username is available here
                        // userId for each player in the team needs to be added later
                    }))
                );
            } else {
                storedData = [];
            }
        } else {
            // For individual games, assuming each player object in localStorage includes their userId
            storedData = JSON.parse(localStorage.getItem('players')) || [];
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
    const scoreUpdating = Object.values(totalScores);
    const selectedGame = useState(JSON.parse(localStorage.getItem('user_selected_game')));
    // const selectedCourse = useState(JSON.parse(localStorage.getItem('user_selected_course')));
    const [isPlayerRecordChosen, setIsPlayerRecordChosen] = useState(false);
    // state for signing scorecard to disable Save Round button until all players have signed
    const [isScorecardSigned, setIsScorecardSigned] = useState(false);

    // Function to calculate the total scores for teams and indiduals
    const [selectedPlayer, setSelectedPlayer] = useState(() => {
        const initialScores = {};

        // For team games
        if (gameType === 'team') {
            const teamsData = JSON.parse(localStorage.getItem('teams')) || [];

            teamsData.forEach(team => {
                team.players.forEach(player => {
                    initialScores[player.name] = { score: 0, point: 0 };
                });
            });
        } else {
            // For individual games
            const playersData = JSON.parse(localStorage.getItem('players')) || [];
            playersData.forEach(player => {
                initialScores[player.username] = { score: 0, point: 0 };
            });
        }

        return initialScores;
    });



    // Function to send all users in Game the selectedGame, userInputCourse.
    useEffect(() => {
        if (isCreator) {
            // Emit the game and course information to other players in the lobby
            socket.emit('gameInfo', {
                selectedGame: selectedGame[0],
                userInputCourse: userInputCourse,
            });
        }
    }, [isCreator, selectedGame, userInputCourse, socket]);



    // listens for gameInfo event and updates the game and course information in localStorage
    // useEffect(() => {
    //     if (socket) {
    //         socket.on('gameInfo', (data) => {
    //             localStorage.setItem('user_selected_game', JSON.stringify(data.selectedGame));

    //             if (data.courseName) {
    //             setUserInputCourse(data.courseName); // Update the course using context
    //         }
    //         });
    //     }

    //     // Cleanup listener on unmount
    //     return () => {
    //         if (socket) {
    //             socket.off('gameInfo');
    //         }
    //     };
    // }, [socket, userInputCourse]);




    // Function to handle score update for each player
    const handleScoreUpdate = (player, score) => {
        var points;
        if (score === 10) {
            points = -2; // X
        } if (score === 2) {
            points = 0; // Double Bogey
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

    console.log('User Input Course:', userInputCourse);
    // New way utilizing userId for individual and team
    const saveRoundData = async () => {
        try {

            const courseName = userInputCourse; // Accessing userInputCourse from context
            const userId = JSON.parse(localStorage.getItem('user_id'));

            let roundData;
            if (gameType === 'individual') {
                // Individual game logic
                roundData = {
                    game: selectedGame[0],
                    course: courseName,
                    userId: userId,
                    players: scorePoints.map(player => ({
                        name: player.user,
                        score: player.score,
                        points: player.point
                    })),
                    winners: winnersList.flatMap(player => player.player),
                    payout: earnings,
                    amountBet: bettingAmount,
                };
            } else if (gameType === 'team') {
                // Team game logic
                roundData = {
                    game: selectedGame[0],
                    course: courseName,
                    userId: userId,
                    teams: teamPoints.map(team => ({
                        teamName: team.team,
                        teamScore: team.score,
                        teamPoints: team.point,
                        players: teams.find(t => t.teamName === team.team).players.map(player => player.name),
                        // Sending only player names
                    })),
                    winningTeam: teamWinnerCalculation() ? teamWinnerCalculation().team : undefined,
                    payout: earnings,
                    amountBet: bettingAmount,
                };
            }

            console.log('Round data being sent to backend:', roundData);
            const response = await axios.post('http://localhost:8000/api/rounds/new', roundData);
            if (response.status === 200) {
                console.log('Round data saved successfully:', response.data);
                navigate("/home");
            } else {
                console.error('Round data was not saved successfully:', response);
            }
        } catch (error) {
            console.error('Error saving round data:', error);
            console.log('Error details:', error.response ? error.response.data : error.message);
        }
    };





    // Function to calculate the total scores for teams and indiduals
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
    };

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
            setIsScorecardSigned(true);
            socket.emit('checkScoreCard', lobby);
            return;
        } catch (err) {
            alert('Unable to sign scorecard');
            setIsLoading(false);
        }
    };

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
                <section className="bg-gray-dark">
                    <div>
                        <h6 className="text-white" >Game Selected: {selectedGame[0]}, Game type: {gameType}</h6>
                        <h1 className="text-salmon-light">Hole #{currentHoleNumber}</h1>
                    </div>
                    {
                        gameType === 'individual' &&
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="text-white border-2 border-indigo-light">
                                        <th scope="col" className="px-2 py-3 text-center">Player</th>
                                        <th scope="col" className="px-2 py-3">Score</th>
                                        <th scope="col" className="px-2 py-3 text-center">Record Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        players.map((player) => {
                                            return (
                                                <tr className="bg-gray-light border-2 border-indigo-light dark:bg-gray-800 dark:border-indigo-light">
                                                    <td className="px-2 py-4 whitespace-nowrap border-2 border-indigo-light" >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-6 h-6 overflow-hidden bg-salmon-light rounded-full dark:bg-blue-dark">
                                                                <svg className="w-full h-full text-salmon-light" fill="currentColor" viewBox="2 0 15 10" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" d="M10 5a2 2 0 100-4 2 2 0 000 4zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                                </svg>
                                                            </div>
                                                            <span className="font-medium text-white dark:text-blue-dark">{player.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2 border-2 border-indigo-light">{selectedPlayer[player.username].score}</td>
                                                    <td className="px-2 py-2">
                                                        <div className="grid grid-cols-3 gap-1 py-1">
                                                            <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.username, -2)} disabled={!isCreator}>-2</button>
                                                            <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.username, -1)} disabled={!isCreator}>-1</button>
                                                            <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.username, 0)} disabled={!isCreator}>Par</button>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-1 py-1 ">
                                                            <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.username, 1)} disabled={!isCreator}>+1</button>
                                                            <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.username, 2)} disabled={!isCreator}>+2</button>
                                                            <button type="button" className="text-white bg-maroon-normal hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.username, 10)} disabled={!isCreator}>X</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    }
                    {
                        gameType === 'team' && teams.map((team) => {
                            return (
                                <div key={team.teamName} className="relative overflow-x-auto shadow-md sm:rounded-lg my-4">
                                    <h4 className="text-salmon-light text-center text-2xl font-bold mb-2">{team.teamName}</h4>
                                    {
                                        team.players.map((player) => {
                                            // Check if 'player.name' exists in 'selectedPlayer'. If it does, use its 'score'. If not, default to 0.
                                            const playerScore = selectedPlayer[player.name] ? selectedPlayer[player.name].score : 0;

                                            return (
                                                <table className="w-full mx-auto text-sm text-left text-white dark:text-white  border-2 border-b border-indigo-light">
                                                    <thead className="text-xs text-white uppercase bg-gray-light dark:bg-gray-light dark:text-white">
                                                        <tr className="text-black border-2 border-indigo-light">
                                                            <th scope="col" className="px-2 py-3 text-center">Player</th>
                                                            <th scope="col" className="px-2 py-3 text-center ">Score</th>
                                                            <th scope="col" className="px-2 py-3 text-center">Record Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr key={player.username} className="bg-gray-light border-2 border-indigo-light dark:bg-gray-normal dark:border-indigo-light text-center">
                                                            <td className="px-2 py-4 whitespace-nowrap" >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-6 h-6 overflow-hidden bg-salmon-light rounded-full dark:bg-blue-dark">
                                                                        <svg className="w-full h-full text-salmon-light" fill="currentColor" viewBox="2 0 15 10" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fillRule="evenodd" d="M10 5a2 2 0 100-4 2 2 0 000 4zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                                        </svg>
                                                                    </div>
                                                                    <span className="font-medium text-white dark:text-blue-dark">{player.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-2 border-2 border-l border-indigo-light">{playerScore}</td>
                                                            <td className="px-2 py-2 border-2 border-l border-indigo-light">
                                                                <div className="grid grid-cols-3 gap-1 py-1">
                                                                    <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.name, -2)} disabled={!isCreator}>-2</button>
                                                                    <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.name, -1)} disabled={!isCreator}>-1</button>
                                                                    <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.name, 0)} disabled={!isCreator}>Par</button>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-1 py-1">
                                                                    <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.name, 1)} disabled={!isCreator}>+1</button>
                                                                    <button type="button" className="text-black bg-salmon-light hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.name, 2)} disabled={!isCreator}>+2</button>
                                                                    <button type="button" className="text-white bg-maroon-normal hover:bg-blue-light focus:outline-none focus:ring-blue-300 font-sm rounded-full text-sm px-2 py-2.5 text-center" onClick={() => handleScoreUpdate(player.name, 10)} disabled={!isCreator}>X</button>
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

                            <button type="submit" disabled={!isCreator} className="inline-flex justify-center py-2 px-4 mt-3 border border-salmon-light rounded-md text-sm font-medium text-white bg-maroon-normal" onClick={(event) => submitScore(event)}>Submit Score</button>
                        </div>
                    </div>
                    <div className="container mx-auto py-4">
                        <h1 className="text-salmon-light text-center text-3xl font-bold mb-4">ScoreCard</h1>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-center text-black dark:text-white">
                                <thead className="text-xs text-black uppercase bg-gray-light dark:bg-gray-light dark:text-black">
                                    <tr className="text-black">
                                        <th className="px-6 py-3">Player</th>
                                        <th id="totalScore" className="px-6 py-3">Score</th>
                                        <th className="px-6 py-3">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        gameType === 'individual'
                                            ? scorePoints.map((player) => (
                                                <tr key={player.user} className="bg-white dark:bg-gray-light">
                                                    <td className="px-6 py-4 whitespace-nowrap">{player.user}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{player.score}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{player.point}</td>
                                                </tr>
                                            ))
                                            : teamPoints.map((team) => (
                                                <tr key={team.team} className="bg-white dark:bg-gray-light">
                                                    <td className="px-6 py-4 whitespace-nowrap">{team.team}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{team.score}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{team.point}</td>
                                                </tr>
                                            ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h4>Betting Amount: ${bettingAmount}</h4>
                    </div>
                    <div className="m-2">
                        {isCreator && (
                            <Link to="/home" className="btn btn-outline-primary btn-sm">
                                Home
                            </Link>
                        )}
                    </div>
                </section>

                :

                <div className="container bg-gray-dark">
                    <h2 className='text-salmon-light p-8'>Round Totals</h2>
                    <table className="w-full divide-y">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">{gameType === 'individual' ? 'Player' : 'Team'}</th>
                                <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Score</th>
                                <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Points</th>
                                {gameType !== 'individual' && <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Players</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-gray-lightest divide-y">
                            {gameType === 'individual'
                                ? scorePoints.map((player, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{player.user}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{player.score}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{player.point}</td>
                                    </tr>
                                ))
                                : teamPoints.map((team, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{team.team}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{team.score}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{team.point}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{team.players.join(', ')}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="min-h-screen text-white text-center mt-4 bg-gray-dark">
                        {
                            gameType === 'individual'
                                ?
                                Array.isArray(winnersList) && winnersList.length === 1 ? (
                                    <h3 className="text-orange-light" colSpan="4">Winner- {winnersList[0].player} Won ${earnings}</h3>
                                ) : (
                                    <h3 style={{ textAlign: "center", color: "purple" }} colSpan="4">
                                        Winners- {winnersList.map(winner => winner.player).join(", ")} Each Won ${earnings}
                                    </h3>
                                )
                                :
                                <p>{teamWinnerCalculation().team} won! ${earnings} will be shared across every player on team</p>
                        }
                        <button className="inline-block leading-6 text-center m-3  w-60 py-2 px-4 border-2 text-lg font-semibold text-white bg-green-dark rounded-md hover:indigo-light focus:outline-none focus:ring" onClick={handleScoreCardSigning}>
                            {
                                isLoading && <span className='spinner-border spinner-border-sm mr-2' role='status' aria-hidden="true"></span>
                            }
                            Sign Scorecard
                        </button>
                        <button type='submit' onClick={saveRoundData} className="inline-block leading-6 text-center w-60 py-2 px-4 border border-transparent text-lg font-semibold text-white bg-maroon-normal rounded-md hover:bg-blue-600 focus:outline-none focus:ring" disabled={!isScorecardSigned}>
                            Save Round
                        </button>
                    </div>
                    <Link to="/home" className="inline-block leading-6 text-center w-60 py-2 px-4 border border-transparent text-sm font-medium text-white bg-maroon-normal rounded-md hover:bg-blue-600 focus:outline-none focus:ring">
                        Home
                    </Link>
                </div>
            }

        </main >

    )

};
export default ScoreCard;