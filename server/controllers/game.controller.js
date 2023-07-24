// const { request } = require('express');

const Game = require("../models/game.model")





// Create new Game 
module.exports.createGame = (req, res) => {
    Game.create(req.body)
        .then(game => res.json(game))
        .catch(err => res.status(400).json(err))


}


// GeT all Games
module.exports.getAllGames = (req, res) => {
    Game.find({})
        .then(game => res.json(game))
        .catch(err => res.json(err))
}


// Read One Game
module.exports.getOneGame = (req, res) => {
    // const idFromParams = req.params.id
    Game.findById(req.params.id)
        .then((oneGame) => { res.json(oneGame) })
        .catch((err) => { res.json({ err: err }) })
}


//Update one Game
module.exports.updateGame = (req, res) => {
    Game.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
        .then(updatedGame => res.json(updatedGame))
        .catch((err) => res.status(400).json(err))
}



// Delete one Game
module.exports.deleteGame = (req, res) => {
    Game.deleteOne({ _id: req.params.id })
        .then(deleteGame => res.json(deleteGame))
        .catch(err => res.json(err))
}
