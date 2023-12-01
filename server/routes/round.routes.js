const express = require('express');
const RoundController = require("../controllers/round.controller");
const { authenticate } = require('../config/jwt.config');
const roundRoutes = express.Router()





// Create Round 
roundRoutes.post('/new', authenticate, RoundController.createRound);


// Get User Round History
roundRoutes.get('/user/:userId', authenticate, RoundController.getUserRounds);



// Get All Rounds
roundRoutes.get('/', authenticate, RoundController.getAllRounds);

// Get One Round
roundRoutes.get(`/:id`, RoundController.getOneRound);

// Update Round
roundRoutes.put(`/:id`, RoundController.updateRound);

// Delete User
roundRoutes.delete(`/:id`, authenticate, RoundController.deleteRound);





module.exports = { roundRoutes }