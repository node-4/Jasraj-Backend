const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    image: {
        type: String,
    },
    password: {
        type: String,
    },
    otp: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ["Admin", "User"], default: "User"
    },
    referralCode: {
        type: String,
    }

}, { timestamps: true });


const User = mongoose.model('User', userSchema);



module.exports = User;