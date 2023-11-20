const Referral = require('../models/refferModel');
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');



exports.createReferral = async (req, res) => {
    try {
        const { referredUserId, referralCode } = req.body;

        const referrerUser = await User.findOne({ referralCode });

        if (!referrerUser) {
            return res.status(400).json({ status: 400, message: 'Invalid referral code' });
        }

        const referral = new Referral({
            referrer: referrerUser._id,
            referredUser: referredUserId,
            referralCode,
        });

        await referral.save();

        return res.status(201).json({ status: 201, message: 'Referral created successfully', data: referral });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error creating referral', error: error.message });
    }
};


// exports.updateReferralStatus = async (req, res) => {
//     try {
//         const { referralId } = req.params;
//         const { status, reward } = req.body;

//         const referral = await Referral.findById(referralId);
//         if (!referral) {
//             return res.status(404).json({ message: 'Referral not found' });
//         }

//         referral.status = status;
//         referral.reward = reward || 0;
//         await referral.save();

//         res.status(200).json({ message: 'Referral updated successfully', data: referral });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };

exports.updateReferralStatus = async (req, res) => {
    try {
        const { referralId } = req.params;
        const { status, reward } = req.body;

        const referral = await Referral.findById(referralId);
        if (!referral) {
            return res.status(404).json({ message: 'Referral not found' });
        }

        if (status === 'Approved') {
            const referrerUser = await User.findById(referral.referrer);

            if (referrerUser) {
                let referrerWallet = await Wallet.findOne({ user: referrerUser._id });

                if (!referrerWallet) {
                    referrerWallet = new Wallet({ user: referrerUser._id, balance: 0 });
                }

                referrerWallet.balance += reward || 0;
                await referrerWallet.save();
            }
        }

        referral.status = status;
        referral.reward = reward || 0;
        await referral.save();


        res.status(200).json({ message: 'Referral updated successfully', data: referral });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.getAllReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find();
        res.status(200).json({ status: 200, data: referrals });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};




exports.getReferralById = async (req, res) => {
    try {
        const referral = await Referral.findById(req.params.referralId);
        if (!referral) {
            return res.status(404).json({ status: 404, message: 'Referral not found' });
        }
        res.status(200).json({ status: 200, data: referral });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};



exports.deleteReferral = async (req, res) => {
    try {
        const referral = await Referral.findByIdAndRemove(req.params.referralId);
        if (!referral) {
            return res.status(404).json({ status: 404, message: 'Referral not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};
