const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const { registrationSchema, generateOtp, otpSchema, loginSchema, resendOtpSchema, userIdSchema, updateUserSchema, updateUserProfileSchema } = require('../validations/userValidation');



exports.register = async (req, res) => {
    try {
        const { userName, mobileNumber, } = req.body;

        const { error } = registrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingUser = await User.findOne({ $or: [{ mobileNumber }] });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: 'User already exists with this mobile' });
        }
        const referId = Math.floor(100000 + Math.random() * 900000);
        const referralCode = referId;

        const user = new User({
            userName,
            mobileNumber,
            otp: generateOtp(),
            referralCode,
        });

        await user.save();

        const welcomeMessage = `Welcome, ${user.userName}! Thank you for registering.`;
        const welcomeNotification = new Notification({
            recipient: user._id,
            content: welcomeMessage,
            type: 'welcome',
        });
        await welcomeNotification.save();


        return res.status(201).json({ status: 201, message: 'User registered successfully', data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};


exports.verifyOTP = async (req, res) => {
    try {
        const userId = req.params.userId
        const { otp } = req.body;

        const { error } = otpSchema.validate({ userId, otp });
        if (error) {
            return res.status(400).json({ status: 400, error: error.details[0].message });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        if (user.otp !== otp) {
            return res.status(401).json({ status: 401, message: 'Invalid OTP' });
        }
        user.isVerified = true;
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: process.env.ACCESS_TOKEN_TIME });
        console.log("Created Token:", token);
        console.log(process.env.SECRET)


        return res.status(200).json({ status: 200, message: 'OTP verified successfully', token: token, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const userId = req.params.userId
        const { mobileNumber } = req.body;

        const { error } = loginSchema.validate({ userId, mobileNumber });
        if (error) {
            return res.status(400).json({ status: 400, error: error.details[0].message });
        }

        const user = await User.findOne({ userId, mobileNumber });

        if (!user) {
            return res.status(401).json({ status: 401, message: 'User not found' });
        }

        user.otp = generateOtp()
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: process.env.ACCESS_TOKEN_TIME, });

        return res.status(200).json({ status: 200, message: 'Login successful', token: token, data: user, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Login failed', error: error.message });
    }
};


exports.resendOTP = async (req, res) => {
    try {
        const { error } = resendOtpSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, error: error.details[0].message });
        }

        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 400, message: 'User not found' });
        }

        const newOTP = generateOtp();
        user.otp = newOTP;
        await user.save();

        return res.status(200).json({ status: 200, message: 'OTP resent successfully', data: user.otp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ status: 200, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching users', error: error.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        const { error } = userIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, error: error.details[0].message });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        return res.status(200).json({ status: 200, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching user', error: error.message });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const { error } = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        if (req.body.userName) {
            user.userName = req.body.userName;
        }
        if (req.body.mobileNumber) {
            user.mobileNumber = req.body.mobileNumber;
        }

        if (req.body.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({ status: 200, message: 'User details updated successfully', data: user });
    } catch (error) {
        return res.status(500).json({ message: 'User details update failed', error: error.message });
    }
};


exports.uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { image: req.file.path, }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        return res.status(200).json({ status: 200, message: 'Profile picture uploaded successfully', data: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
    }
};