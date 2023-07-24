// const { request } = require('express');

const Round = require("../models/round.model")





// Create new Round
module.exports.createRound = (req, res) => {
    Round.create(req.body)
        .then(game => res.json(game))
        .catch(err => res.status(400).json(err))


}


// GeT all Rounds
module.exports.getAllRounds = (req, res) => {
    Round.find({})
        .then(game => res.json(game))
        .catch(err => res.json(err))
}


// Read One Round
module.exports.getOneRound = (req, res) => {
    // const idFromParams = req.params.id
    Round.findById(req.params.id)
        .then((oneRound) => { res.json(oneRound) })
        .catch((err) => { res.json({ err: err }) })
}


//Update one Round
module.exports.updateRound = (req, res) => {
    Game.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
        .then(updatedRound => res.json(updatedRound))
        .catch((err) => res.status(400).json(err))
}



// Delete one Round
module.exports.deleteRound = (req, res) => {
    Game.deleteOne({ _id: req.params.id })
        .then(deleteRound => res.json(deleteRound))
        .catch(err => res.json(err))
}
