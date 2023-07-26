// const { request } = require('express');

const Round = require("../models/round.model")




// Create new Round
module.exports.createRound = (req, res) => {
    const roundData = req.body;
    console.log(req.body);
    Round.create(req.body)
        .then(round => res.json(round))
        .catch(err => res.status(400).json(err));
};

// Get all Rounds
module.exports.getAllRounds = (req, res) => {
    Round.find()
        .then(rounds => res.json(rounds))
        .catch(err => res.json(err));
};

// Read One Round
module.exports.getOneRound = (req, res) => {
    Round.findById(req.params.id)
        .then(oneRound => res.json(oneRound))
        .catch(err => res.json({ err: err }));
};

// Update one Round
module.exports.updateRound = (req, res) => {
    Round.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
        .then(updatedRound => res.json(updatedRound))
        .catch(err => res.status(400).json(err));
};

// Delete one Round
module.exports.deleteRound = (req, res) => {
    Round.deleteOne({ _id: req.params.id })
        .then(deleteRound => res.json(deleteRound))
        .catch(err => res.json(err));
};