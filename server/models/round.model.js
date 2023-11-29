const mongoose = require('mongoose');


const RoundSchema = new mongoose.Schema({
    // Include a field to store the userId of the user who saved the round
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    players: [
        {
            name: String,
            score: Number,
            points: Number
        }
    ],
    winners: [], // Array of player/s names that won round
    payout: String,
    amountBet: Number,
    game: String,
    course: String
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