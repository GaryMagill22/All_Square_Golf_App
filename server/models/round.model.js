const mongoose = require('mongoose');






const RoundSchema = new mongoose.Schema({
    players: [],
    winners: [],
    payout: String,
    amountBet: Number,
    game: String,
    coursePicked: String
    // player1: {
    //     type: String,
    // },
    // player2: {
    //     type: String,
    // },
    // player3: {
    //     type: String,
    // },
    // player4: {
    //     type: String,
    // },
    // game: {
    //     type: String,
    // },
    // course: {
    //     type: String,
    // },
    // player1TotalScore: {
    //     type: Number,
    // },
    // player2TotalScore: {
    //     type: Number,
    // },
    // player3TotalScore: {
    //     type: Number,
    // },
    // player4TotalScore: {
    //     type: Number,
    // },
    // player1Outcome: {
    //     type: Number,
    // },
    // player2Outcome: {
    //     type: Number,
    // },
    // player3Outcome: {
    //     type: Number,
    // },
    // player4Outcome: {
    //     type: Number,
    // },
    // player1TotalPoints: {
    //     type: Number,
    // },
    // player2TotalPoints: {
    //     type: Number,
    // },
    // player3TotalPoints: {
    //     type: Number,
    // },
    // player4TotalPoints: {
    //     type: Number,
    // },
    // player1MoneyEarned: {
    //     type: Number,
    // },
    // player2MoneyEarned: {
    //     type: Number,
    // },
    // player3MoneyEarned: {
    //     type: Number,
    // },
    // player4MoneyEarned: {
    //     type: Number,
    // },




})



const Round = mongoose.model('Round', RoundSchema)

module.exports = Round;