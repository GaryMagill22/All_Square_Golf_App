const express = require('express');
const LobbyController = require('../controllers/lobby.controller');
const { authenticate } = require('../config/jwt.config');



const lobbyRoutes = express.Router();


// All LOBBY ROUTES



// Create Lobby
lobbyRoutes.post('/new', authenticate, LobbyController.createLobby)


// Get All Lobbys
lobbyRoutes.get('/', authenticate, LobbyController.createLobby)



// Get One User
lobbyRoutes.get(`/:id`, authenticate, LobbyController.createLobby)



// Update Lobby
lobbyRoutes.put('/:id', authenticate, LobbyController.createLobby)



// Delete User
lobbyRoutes.delete('/:id', authenticate, LobbyController.createLobby);

lobbyRoutes.post('/update-users/:id', async (req, res) => {
    const lobbyId = req.params.id;
    const updatedPlayers = req.body.updatedPlayers;
    try {
        const updatedLobby = await LobbyController.updateUsersByLobbyId(lobbyId, updatedPlayers);
        res.json(updatedLobby);
    } catch (error) {
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