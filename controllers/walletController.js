const UserWallet = require('../models/walletModel');
const User = require('../models/userModel');

const { walletBalanceSchema, updateWalletBalanceSchema } = require('../validations/walletValidation');


exports.createUserWallet = async (req, res) => {
    try {
        const { userId } = req.params;

        const { error } = walletBalanceSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const existingWallet = await UserWallet.findOne({ user: userId });
        if (existingWallet) {
            return res.status(400).json({ status: 400, message: 'User wallet already exists' });
        }

        const userWallet = new UserWallet({ user: userId });
        await userWallet.save();

        return res.status(201).json({ status: 201, message: 'User wallet created successfully', data: userWallet });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error creating user wallet', error: error.message });
    }
};


exports.updateWalletBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        const { error } = updateWalletBalanceSchema.validate({ userId, amount });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const userWallet = await UserWallet.findOne({ user: userId });

        if (!userWallet) {
            return res.status(404).json({ status: 404, message: 'User wallet not found' });
        }

        userWallet.balance += amount;
        await userWallet.save();

        return res.status(200).json({ status: 200, message: 'Wallet balance updated successfully', data: userWallet.balance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error updating wallet balance', error: error.message });
    }
};


exports.getWalletBalance = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const userWallet = await UserWallet.findOne({ user: userId });
        if (!userWallet) {
            return res.status(404).json({ status: 404, message: 'User wallet not found' });
        }

        return res.status(200).json({ status: 200, message: 'Wallet balance retrieved successfully', data: userWallet.balance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error retrieving wallet balance', error: error.message });
    }
};


exports.deleteWallet = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const userWallet = await UserWallet.findOne({ user: userId });

        if (!userWallet) {
            return res.status(404).json({ status: 404, message: 'User wallet not found' });
        }

        await UserWallet.findByIdAndRemove(userWallet._id);

        return res.status(204).json({ status: 204, message: "Wallet Deleted Sucessfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error deleting wallet', error: error.message });
    }
};
