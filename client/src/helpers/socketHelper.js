import io from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (!socket) {
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