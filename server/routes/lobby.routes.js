const express = require('express');
const LobbyController = require('../controllers/lobby.controller');
const { authenticate } = require('../config/jwt.config');



const lobbyRoutes = express.Router();


// All LOBBY ROUTES



// Create Lobby
lobbyRoutes.post('/new', authenticate, LobbyController.createLobby)


// Get All Lobbys
lobbyRoutes.get('/', authenticate, LobbyController.getAllLobbys)



// Get One Lobby
lobbyRoutes.get(`/:id`, authenticate, LobbyController.getOneLobby)



// Update Lobby
lobbyRoutes.put('/:id', authenticate, LobbyController.updateLobby)



// Delete Lobby
lobbyRoutes.delete('/:id', authenticate, LobbyController.deleteLobby);



// changed id to lobbyId
lobbyRoutes.post('/update-users/:lobbyId', async (req, res) => {
    const lobbyId = req.params.lobbyId;
    const updatedPlayers = req.body.updatedPlayers;
    try {
        const updatedLobby = await LobbyController.updateUsersByLobbyId(lobbyId, updatedPlayers);
        res.json(updatedLobby);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating users.' });
    }
});


lobbyRoutes.get('/get-users-in-room/:id', async (req, res) => {
    const lobbyId = req.params.id;
    try {
        const users = await LobbyController.getUsersByLobbyId(lobbyId);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error getting users.' });
    }
});

module.exports = { lobbyRoutes }