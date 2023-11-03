import io from 'socket.io-client';

let socket = null;

export const initSocket = () => {

    // environment variable for socket connection
    const socketURL = process.env.REACT_APP_SOCKET_URL;
    console.log('socket helper - socketURL:', socketURL);

    if (!socket) {
        // Deployment/Production using environment variable
        socket = io(socketURL);


        socket.on('connect', () => {
            console.log('SocketHelper - Socket Connected to server');
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