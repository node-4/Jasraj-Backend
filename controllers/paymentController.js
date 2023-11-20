const mongoose = require('mongoose');
const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productmodel');
const SubCategory = require('../models/subCategoryModel');
const Category = require('../models/categoryModel');
const Coupon = require('../models/couponModel');
const UserWallet = require('../models/walletModel');


const { createPaymentSchema, paymentIdSchema, trackIdSchema, updatePaymentStatusSchema } = require('../validations/paymentValidation');



// exports.createPayment = async (req, res) => {
//     try {
//         const { error } = createPaymentSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ status: 400, message: error.details[0].message });
//         }

//         const { orderId, paymentMethod } = req.body;
//         const userId = req.user.id;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ status: 404, message: 'User not found' });
//         }

//         const order = await Order.findById(orderId);

//         if (!order) {
//             return res.status(404).json({ status: 404, message: 'Order not found' });
//         }

//         const amount = order.totalAmount;

//         const payment = new Payment({
//             user: userId,
//             order: orderId,
//             amount,
//             paymentMethod,
//         });

//         await payment.save();

//         order.paymentMethod = paymentMethod;
//         await order.save();

//         return res.status(201).json({ status: 201, message: 'Payment record created successfully', data: payment });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 500, message: 'Error creating payment record', error: error.message });
//     }
// };


exports.createPayment = async (req, res) => {
    try {
        const { error } = createPaymentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const { orderId, paymentMethod, walletId } = req.body;
        const userId = req.user.id;
        console.log("userId", userId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ status: 404, message: 'Order not found' });
        }

        const amount = order.totalAmount;

        const walletUsed = Boolean(walletId);

        let paymentAmount = amount;
        let walletBalance = 0;

        if (walletUsed) {
            const wallet = await UserWallet.findById(walletId);
            if (!wallet) {
                return res.status(404).json({ status: 404, message: 'Wallet not found' });
            }

            console.log("wallet.user", wallet.user);

            if (!wallet.user.equals(new mongoose.Types.ObjectId(userId))) {
                return res.status(400).json({ status: 400, message: 'Wallet does not belong to the current user' });
            }

            walletBalance = wallet.balance;

            if (walletBalance >= amount) {
                paymentAmount = 0;
                wallet.balance -= amount;
            } else {
                paymentAmount -= walletBalance;
                wallet.balance = 0;
            }

            await wallet.save();
        }

        const payment = new Payment({
            user: userId,
            order: orderId,
            wallet: walletId,
            walletUsed,
            amount: paymentAmount,
            paymentMethod,
        });

        await payment.save();

        order.paymentMethod = paymentMethod;
        order.status = 'Processing';

        await order.save();

        return res.status(201).json({
            status: 201,
            message: 'Payment record created successfully',
            data: {
                payment,
                walletBalance,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error creating payment record', error: error.message });
    }
};


exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user', 'userName mobileNumber image').populate('order').populate('wallet');

        return res.status(200).json({ status: 200, message: 'Payments retrieved successfully', data: payments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error retrieving payments', error: error.message });
    }
};


exports.getPaymentDetails = async (req, res) => {
    try {
        const paymentId = req.params.paymentId;

        const { error } = paymentIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const payment = await Payment.findById(paymentId).populate('user', 'userName mobileNumber image').populate('order').populate('wallet');

        if (!payment) {
            return res.status(404).json({ status: 404, message: 'Payment record not found' });
        }

        return res.status(200).json({ status: 200, message: 'Payment details retrieved successfully', data: payment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error retrieving payment details', error: error.message });
    }
};


exports.updatePaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const { status } = req.body;

        const { error } = updatePaymentStatusSchema.validate({ paymentId, status });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const payment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });

        if (!payment) {
            return res.status(404).json({ status: 404, message: 'Payment record not found' });
        }

        if (status === 'Completed') {
            const order = await Order.findOne({ _id: payment.order });
            if (order) {
                order.paymentStatus = 'Completed';
                await order.save();
            }
        } else if (status === 'Failed') {
            const order = await Order.findOne({ _id: payment.order });
            if (order) {
                order.paymentStatus = 'Failed';
                await order.save();
            }
        } else if (status === 'Pending') {
            const order = await Order.findOne({ _id: payment.order });
            if (order) {
                order.paymentStatus = 'Pending';
                await order.save();
            }
        }


        return res.status(200).json({ status: 200, message: 'Payment status updated successfully', data: payment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error updating payment status', error: error.message });
    }
};


exports.deletePayment = async (req, res) => {
    try {
        const paymentId = req.params.paymentId;

        const { error } = paymentIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const payment = await Payment.findByIdAndRemove(paymentId);

        if (!payment) {
            return res.status(404).json({ status: 404, message: 'Payment record not found' });
        }

        return res.status(204).json();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error deleting payment record', error: error.message });
    }
};


exports.trackOrder = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber;

        const { error } = trackIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const order = await Order.findOne({ trackingNumber })
            .populate('user', 'userName mobileNumber image')
            .populate({
                path: 'products.product',
                select: 'productName productDescription productImage',
            });

        if (!order) {
            return res.status(404).json({ status: 404, message: 'Order not found' });
        }

        return res.status(200).json({ status: 200, message: 'Order details retrieved successfully', data: order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error retrieving order details', error: error.message });
    }
};
