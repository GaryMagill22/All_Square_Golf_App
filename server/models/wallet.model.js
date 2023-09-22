const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: [true, "Wallet amount is required"],
    }
}, { timestamps: true });

module.exports.Wallet = mongoose.model('Wallet', walletSchema);

