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



// Update User
lobbyRoutes.put('/:id', authenticate, LobbyController.createLobby)



// Delete User
lobbyRoutes.delete('/:id', authenticate, LobbyController.createLobby);


module.exports = { lobbyRoutes }