const express = require('express');
const RoundController = require("../controllers/round.controller");
const roundRoutes = express.Router()





// Create Round using RoundController
roundRoutes.post('/new', RoundController.createRound);

// Get All Rounds
roundRoutes.get('/', RoundController.getAllRounds);

// Get One Round
roundRoutes.get(`/:id`, RoundController.getOneRound);

// Update Round
roundRoutes.put('/:id', RoundController.updateRound);

// Delete User
roundRoutes.delete('/:id', RoundController.deleteRound);





module.exports = { roundRoutes }
