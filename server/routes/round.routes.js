const express = require('express');
const RoundController = require("../controllers/round.controller");
const { authenticate } = require('../config/jwt.config');
const roundRoutes = express.Router()





// Create Round using RoundController
roundRoutes.post('/new', authenticate, RoundController.createRound);

// Get All Rounds
roundRoutes.get('/', authenticate, RoundController.getAllRounds);

// Get One Round
roundRoutes.get(`/:id`, authenticate, RoundController.getOneRound);

// Update Round
roundRoutes.put('/:id', authenticate, RoundController.updateRound);

// Delete User
roundRoutes.delete('/:id', authenticate, RoundController.deleteRound);





module.exports = { roundRoutes }
