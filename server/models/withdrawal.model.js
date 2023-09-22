const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: [true, "Withdrawal amount is required"],
    },
    reference: {
        type: String,
        required: [true, "Withdrawal reference is required"],
    },
    isPaid: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports.Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);