const mongoose = require('mongoose');


const gameScorecardSchema = new mongoose.Schema({
    lobbyId: {
        type: String,
        ref: 'Lobby',
        require: true,
    },
    players: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
            require: true,
        },
        isConfirmed: {
            type: Boolean,
            require: true,
        },
    }],

    winners: [
        {
            type: String,
            default: null
        }
    ],
    winningAmount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })



const GameScoreCard = mongoose.model('gamescorecard', gameScorecardSchema)

module.exports = GameScoreCard;