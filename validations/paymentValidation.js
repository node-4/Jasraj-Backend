const Joi = require('joi');
const mongoose = require('mongoose');


exports.createPaymentSchema = Joi.object({
    orderId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    walletId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .optional(),
    paymentMethod: Joi.string().valid('Credit Card', 'Online', 'Cash on Delivery').required(),
});



exports.paymentIdSchema = Joi.object({
    paymentId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.trackIdSchema = Joi.object({
    trackingNumber: Joi.string().required(),
});


exports.updatePaymentStatusSchema = Joi.object({
    paymentId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    status: Joi.string().valid('Pending', 'Completed', 'Failed').required(),
});

