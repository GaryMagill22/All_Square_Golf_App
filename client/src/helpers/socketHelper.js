import io from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (!socket) {
        socket = io('wss://allsquare.club:');  

        socket.on('connect', () => {
            console.log('Socket connected to server');
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