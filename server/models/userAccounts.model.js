const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accountId: {
        type: String,
        required: [true, 'Kindly provide account id'],
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports.UserAccount = mongoose.model('UserAccount', userAccountSchema);