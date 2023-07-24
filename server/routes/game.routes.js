const express = require('express');
const GameController = require('../controllers/game.controller');




const gameRoutes = express.Router();

// ALL GAME ROUTES

// Create Game
gameRoutes.post('/new', GameController.createGame)


// Get All Games
gameRoutes.get('/', GameController.getAllGames)



// Get One Game
gameRoutes.get(`/:id`, GameController.getOneGame)



// Update Game
gameRoutes.put('/:id', GameController.updateGame)



// Delete Game
gameRoutes.delete('/:id', GameController.deleteGame);


module.exports = { gameRoutes }