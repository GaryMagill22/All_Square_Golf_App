const express = require('express');
const LobbyController = require('../controllers/lobby.controller')



const lobbyRoutes = express.Router();


// All LOBBY ROUTES



// Create Lobby
lobbyRoutes.post('/new', LobbyController.createLobby)


// Get All Lobbys
lobbyRoutes.get('/', LobbyController.createLobby)



// Get One User
lobbyRoutes.get(`/:id`, LobbyController.createLobby)



// Update User
lobbyRoutes.put('/:id', LobbyController.createLobby)



// Delete User
lobbyRoutes.delete('/:id', LobbyController.createLobby);


module.exports = { lobbyRoutes }