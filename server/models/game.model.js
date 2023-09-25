const mongoose = require('mongoose');


const GameSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    minPlayers: {
        type: String,
    },
    maxPlayers: {
        type: String,
    },
    howToPlay: {
        type: String,
    }



}, { timestamps: true })



const Game = mongoose.model('game', GameSchema)

module.exports = Game;

