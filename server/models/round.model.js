const mongoose = require('mongoose');


const RoundSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: String,
    course: String,
    amountBet: Number,
    payout: String,
    winners: [], // Array of player/s names that won round
    players: [ // For individual games
        {
            name: String,
            score: Number,
            points: Number
        }
    ],
    teams: [ // For team games
        {
            teamName: String,
            teamScore: Number,
            teamPoints: Number,
            players: [String] // Array of player names on each team
        }
    ]
}, { timestamps: true });



const Round = mongoose.model('Round', RoundSchema)

module.exports = Round;




// Old model before implementing userId to get user specific rounds
// const RoundSchema = new mongoose.Schema({
//     players: [],
//     winners: [],
//     payout: String,
//     amountBet: Number,
//     game: String,
//     course: String
// }, { timestamps: true });