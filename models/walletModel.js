const mongoose = require('mongoose');

const userWalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
        required: true,
    },
});

const UserWallet = mongoose.model('UserWallet', userWalletSchema);

module.exports = UserWallet;
