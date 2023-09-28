const Game = require("../models/game.model");
const GameScoreCard = require('../models/gameScorecard.model');




// Create new Game 
module.exports.createGame = (req, res) => {
    const { name, isTeamGame, howToPlay } = req.body;

    Game.create({
        name: name,
        isTeamGame: isTeamGame,
        // howToPlay: howToPlay,
    })
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

module.exports.signScoreCard = async (req, res) => {
    try {
        const { lobbyId } = req.params;
        // Find the gameScoreCard document by lobbyId
        const gameScoreCard = await GameScoreCard.findOne({ lobbyId });
        if (!gameScoreCard) {
            return res.status(404).json({
                status: false,
                message: 'GameScorecard not found.',
            });
        }

        // Find the index of the player with the specified user ID
        const playerIndex = gameScoreCard.players.findIndex((player) => player.user_id.toString() === req.user.id);
        if (playerIndex === -1) {
            return res.status(404).json({
                status: false,
                message: 'You are not a participant of this game.',
            });
        }

        // Update the isConfirmed field for the specified user
        gameScoreCard.players[playerIndex].isConfirmed = true;
        await gameScoreCard.save();
        return res.status(200).json({
            status: true,
            message: `You have successfully signed the game Scorecard.`,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Unable to sign scorecard',
        })
    }
}
