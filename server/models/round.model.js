const mongoose = require('mongoose');




// Need Id or unique code for each round

const RoundSchema = new mongoose.Schema({
    players: [],
    winners: [],
    payout: String,
    amountBet: Number,
    game: String,
    course: String
}, { timestamps: true });



const Round = mongoose.model('Round', RoundSchema)

module.exports = Round;