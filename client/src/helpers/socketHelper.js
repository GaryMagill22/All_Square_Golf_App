import io from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (!socket) {
        // Deployment
        socket = io('wss://allsquare.club:9000');
        // Local
        socket = io('ws://localhost:8000');  

        

        socket.on('connect', () => {
            console.log('Connected to server');
            //socket.emit('joinLobby', lobbyId);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected from server');
        });
    }
}

export const getSocket = () => socket;


// functions for TEAM LOBBY 

export const joinTeamLobby = (lobbyId) => {
    if (socket) {
        socket.emit('joinTeamLobby', lobbyId);
    }
}

export const listeToTeamUpdates = (callback) => {
    if (socket) {
        socket.on('teamLobbyUpdate', callback);
    }
}