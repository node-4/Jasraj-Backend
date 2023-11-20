const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    discountType: {
        type: String,
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
    },
    expiryDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
