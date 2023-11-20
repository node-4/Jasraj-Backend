const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productmodel');
const SubCategory = require('../models/subCategoryModel');
const Category = require('../models/categoryModel');
const Coupon = require('../models/couponModel');
const Notification = require('../models/notificationModel');


const { createOrderValidation, updateOrderStatusValidation, orderIdValidation } = require('../validations/orderValidation');



const generateTrackingNumber = () => {
    const date = new Date();
    const randomId = Math.floor(Math.random() * 10000);
    const trackingNumber = `TN-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${randomId}`;
    return trackingNumber;
};


const createOrderNotification = async (userId, orderId, totalAmount) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const orderMessage = `Thank you for your order! Your order ID is ${orderId} and the total amount is $${totalAmount}.`;

        const orderNotification = new Notification({
            recipient: user._id,
            content: orderMessage,
            type: 'order',
        });

        await orderNotification.save();
    } catch (error) {
        console.error(error);
        throw new Error('Error creating order notification');
    }
};



// exports.checkOut = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const { shippingAddressId, paymentMethod } = req.body;
//         if (!shippingAddressId || !paymentMethod) {
//             return res.status(400).json({ status: 400, message: 'Shipping address and payment method are required.' });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ status: 404, message: 'User not found' });
//         }

//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) {
//             return res.status(404).json({ status: 404, message: 'Cart not found' });
//         }

//         const shippingAddress = await Address.findById(shippingAddressId);
//         if (!shippingAddress) {
//             return res.status(404).json({ status: 404, message: 'Shipping address not found' });
//         }

//         let totalAmount = 0;
//         for (const cartProduct of cart.products) {
//             totalAmount += cartProduct.price * cartProduct.quantity;
//         }

//         const order = new Order({
//             user: userId,
//             products: cart.products,
//             totalAmount,
//             shippingAddress: shippingAddressId,
//             paymentMethod,
//         });

//         for (const cartProduct of cart.products) {
//             const product = await Product.findById(cartProduct.product);
//             if (!product) {
//                 return res.status(404).json({ status: 404, message: 'Product not found' });
//             }
//             product.stock -= cartProduct.quantity;
//             await product.save();
//         }

//         await Cart.deleteOne({ _id: cart._id });

//         await order.save();

//         return res.status(201).json({ status: 201, message: 'Order created successfully', data: order });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 500, message: 'Error processing checkout', error: error.message });
//     }
// };



// exports.createOrder = async (req, res) => {
//     try {
//         const { error } = createOrderValidation.validate(req.body);
//         if (error) {
//             return res.status(400).json({ status: 400, message: error.details[0].message });
//         }

//         const { products, shippingAddressId, /*paymentMethod*/ } = req.body;
//         const userId = req.user.id;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ status: 404, message: 'User not found' });
//         }

//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) {
//             return res.status(404).json({ status: 404, message: 'Cart not found' });
//         }

//         const address = await Address.findById(shippingAddressId);
//         if (!address) {
//             return res.status(404).json({ status: 404, message: 'Shipping address not found' });
//         }

//         const orderProducts = [];
//         let totalAmount = 0;

//         for (const productItem of products) {
//             const productId = productItem.product;
//             if (!mongoose.isValidObjectId(productId)) {
//                 return res.status(400).json({ status: 400, message: `Invalid product ID: ${productId}` });
//             }

//             const productIdObject = new mongoose.Types.ObjectId(productId);

//             const cartProduct = cart.products.find(
//                 (item) => item.product.equals(productIdObject)
//             );

//             if (!cartProduct) {
//                 return res.status(404).json({
//                     status: 404,
//                     message: `Product with ID ${productId} not found in cart`,
//                 });
//             }

//             const productQuantity = productItem.quantity || cartProduct.quantity;

//             cartProduct.quantity -= productQuantity;

//             const productPrice = cartProduct.price;
//             const productTotalAmount = productPrice * productQuantity;

//             totalAmount += productTotalAmount;

//             orderProducts.push({
//                 product: productIdObject,
//                 quantity: productQuantity,
//                 price: productPrice,
//                 totalAmount: productTotalAmount,
//             });
//         }

//         await cart.save();

//         const order = new Order({
//             user: userId,
//             products: orderProducts,
//             totalAmount,
//             shippingAddress: shippingAddressId,
//             paymentMethod,
//             trackingNumber: generateTrackingNumber(),

//         });

//         await order.save();

//         await createOrderNotification(userId, order._id, totalAmount);


//         return res.status(201).json({ status: 201, message: 'Order created successfully', data: order });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 500, message: 'Error creating order', error: error.message });
//     }
// };


exports.createOrder = async (req, res) => {
    try {
        const { error } = createOrderValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const { shippingAddressId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ status: 404, message: 'Cart not found' });
        }

        const address = await Address.findById(shippingAddressId);
        if (!address) {
            return res.status(404).json({ status: 404, message: 'Shipping address not found' });
        }

        const orderProducts = cart.products;
        let totalAmount = orderProducts.reduce((total, cartProduct) => total + cartProduct.totalAmount, 0);

        await cart.save();

        const order = new Order({
            user: userId,
            products: orderProducts,
            totalAmount,
            shippingAddress: shippingAddressId,
            trackingNumber: generateTrackingNumber(),
        });

        await order.save();

        await createOrderNotification(userId, order._id, totalAmount);

        return res.status(201).json({ status: 201, message: 'Order created successfully', data: order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error creating order', error: error.message });
    }
};


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'products.product',
                select: 'productName price image',
            })
            .populate({
                path: 'user',
                select: 'userName mobileNumber',
            })
            .populate({
                path: 'shippingAddress',
                select: 'fullName phone addressLine1 city state postalCode country isDefault',
            });
        return res.status(200).json({ status: 200, message: 'Orders retrieved successfully', data: orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching orders', error: error.message });
    }
};


exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const { error } = orderIdValidation.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const order = await Order.findById(orderId)
            .populate({
                path: 'products.product',
                select: 'productName price image',
            })
            .populate({
                path: 'user',
                select: 'userName mobileNumber',
            })
            .populate({
                path: 'shippingAddress',
                select: 'fullName phone addressLine1 city state postalCode country isDefault',
            });

        if (!order) {
            return res.status(404).json({ status: 404, message: 'Order not found' });
        }

        return res.status(200).json({ status: 200, message: 'Order retrieved successfully', data: order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching order', error: error.message });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const { error } = updateOrderStatusValidation.validate({ orderId, status });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ status: 404, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ status: 200, message: 'Order status updated successfully', data: order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error updating order status', error: error.message });
    }
};


exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId }).populate({
            path: 'products.product',
            select: 'productName price image',
        })
            .populate({
                path: 'user',
                select: 'userName mobileNumber',
            })
            .populate({
                path: 'shippingAddress',
                select: 'fullName phone addressLine1 city state postalCode country isDefault',
            });

        return res.status(200).json({ status: 200, message: 'Order history retrieved successfully', data: orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching order history', error: error.message });
    }
};
