const mongoose = require('mongoose');


const LobbySchema = new mongoose.Schema({
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    selectedGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    selectedCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    lobbyId: {
        type: String,
        require: true,
    }

}, { timestamps: true })



const Lobby = mongoose.model('lobby', LobbySchema)

module.exports = Lobby;

