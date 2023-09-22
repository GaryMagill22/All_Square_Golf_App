const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentRef: {
        type: String,
        required: [true, 'Kindly provide payment reference'],
    },
    amount: {
        type: Number,
        required: [true, "Wallet amount is required"],
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    }
}, { timestamps: true });

module.exports.Payment = mongoose.model('Payment', paymentSchema);