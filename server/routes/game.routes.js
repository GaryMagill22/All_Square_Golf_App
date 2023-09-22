const express = require('express');
const GameController = require('../controllers/game.controller');
const { authenticate } = require('../config/jwt.config');




const gameRoutes = express.Router();

// ALL GAME ROUTES

// Create Game
gameRoutes.post('/new', authenticate, GameController.createGame)


// Get All Games
gameRoutes.get('/', authenticate, GameController.getAllGames)



// Get One Game
gameRoutes.get(`/:id`, authenticate, GameController.getOneGame)



// Update Game
gameRoutes.put('/:id', authenticate, GameController.updateGame)



// Delete Game
gameRoutes.delete('/:id', authenticate, GameController.deleteGame);

// Route for user to sign game scorecard
gameRoutes.patch('/signscorecard/:lobbyId', authenticate, GameController.signScoreCard);


module.exports = { gameRoutes }