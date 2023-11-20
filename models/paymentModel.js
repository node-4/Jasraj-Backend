const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserWallet',
    },
    walletUsed: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Online', 'Cash on Delivery'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
