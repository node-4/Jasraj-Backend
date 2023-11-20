const Joi = require('joi');
const mongoose = require('mongoose');



exports.createOrderValidation = Joi.object({
    // products: Joi.array().items(
    //     Joi.object({
    //         product: Joi.string()
    //             .custom((value, helpers) => {
    //                 if (!mongoose.isValidObjectId(value)) {
    //                     return helpers.error('any.invalid');
    //                 }
    //                 return value;
    //             })
    //             .required(),
    //         quantity: Joi.number().integer().min(1).optional(),
    //         quantity: Joi.number().integer().min(1).optional(),
    //     })
    // ).required(),
    totalAmount: Joi.number().min(0).optional(),
    shippingAddressId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    // paymentMethod: Joi.string().valid('Credit Card', 'PayPal', 'Cash on Delivery').required(),
});




exports.orderIdValidation = Joi.object({
    orderId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.updateOrderStatusValidation = Joi.object({
    orderId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').required(),
});
