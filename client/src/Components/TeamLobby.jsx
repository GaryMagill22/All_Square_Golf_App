import React, { useEffect, useState } from 'react';
import { getSocket } from '../helpers/socketHelper';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import LobbyPage from '../Pages/LobbyPage';





const TeamLobby = () => {
    // grabbing the lobbyId from url of Home.jsx Page to use on this page.
    const location = useLocation();

    const socket = getSocket();
    const { lobbyId } = useParams();
    const [isCreator, setIsCreator] = useState(false);
    const [teams, setTeams] = useState([]); // For teams data
    const navigate = useNavigate();

    // state for setting what game user picks
    const [gamePicked, setGamePicked] = useState('');
    // state for setting what course user picks
    const [coursePicked, setCoursePicked] = useState('');
    // state for loading in all of the db courses to choose from
    const [course, setCourse] = useState([]);
    const [setLoaded] = useState(false);
    // setting state for loading in all of the db games to choose from
    const [games, setGames] = useState([]);
    // state for setting user inputting players to play with.
    const [players, setPlayers] = useState([]);
    const [creator, setCreator] = useState('');

    const [user, setUser] = useState(null);
    const [bettingAmount, setBettingAmount] = useState(0); // State for how much money betting.

    const [roomKey, setRoomKey] = useState('');
    // state to show or not show team lobby
    const [showTeamLobby, setShowTeamLobby] = useState(false);


    const createTeam = () => {
        const teamName = prompt("Enter team name:"); // simple prompt for team name
        if (teamName) {
            setTeams(prevTeams => [...prevTeams, { name: teamName, members: [players] }]); // Add the new team to the list.
            socket.emit('createTeam', { lobbyId, teamName, creator: user._id }); // Assuming user._id exists
        }
    };

    const addPlayerToTeam = (playerId, teamId) => {
        socket.emit('addPlayerToTeam', { playerId, teamId, lobbyId });
    };


    // for Joining TEAM LOBBY
    useEffect(() => {
        if (socket) {
            // Joining the team lobby.
            socket.emit('joinTeamLobby', lobbyId);

            socket.on('joinSuccess', (response) => {
                const userId = JSON.parse(localStorage.getItem('user_id'));
                if (userId === response.creatorId) {
                    setIsCreator(true);
                }
                // Handle other logic here if necessary.
            });

            socket.on('proceedToGameReceived', (data) => {
                if (data.status) {
                    localStorage.setItem('teamLobby', lobbyId); // Consider naming conventions for local storage keys.
                    navigate('/new/teamGame');
                } else {
                    alert(data.message);
                }
            });

            // New event to handle team formation.
            socket.on('teamFormed', (teamData) => {
                setTeams(prevTeams => [...prevTeams, teamData]); // Add the new team to the list.
            });

            // New event to handle a team member joining.
            socket.on('teamMemberJoined', (memberData) => {
                // Locate the team and add the member. This assumes memberData has both the teamId and the member details.
                const updatedTeams = teams.map(team =>
                    team.id === memberData.teamId ? { ...team, members: [...team.members, memberData.member] } : team
                );
                setTeams(updatedTeams);
            });
        }

        //cleanup function to remove these listeners when the component unmounts.
        return () => {
            if (socket) {
                socket.off('joinSuccess');
                socket.off('proceedToGameReceived');
                socket.off('teamFormed');
                socket.off('teamMemberJoined');
            }
        };

    }, [socket, lobbyId, teams]);



    // Grabbing user that is logged in and using data in local Storage
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((error) => console.log(error));
    }, []);








    return (
        <div>

            {/* List available teams and the players in them */}
            <div className="teams-container">
                {teams.map(team => (
                    <div key={team.id} className="team-panel">
                        <h3>{team.name}</h3>
                        <ul>
                            {team.members.map(member => (
                                <li key={member._id}>{member.name}</li>
                            ))}
                        </ul>
                        {/* For simplicity, allowing anyone to add players. You might want to restrict this. */}
                        {players.length > 0 &&
                            <select onChange={e => addPlayerToTeam(e.target.value, team.id)}>
                                <option value="">Add player to team</option>
                                {players.map(player => (
                                    <option key={player._id} value={player._id}>{player.name}</option>
                                ))}
                            </select>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};
export default TeamLobby;
