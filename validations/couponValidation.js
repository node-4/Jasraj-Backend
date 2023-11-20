const Joi = require('joi');
const mongoose = require('mongoose');



exports.couponSchema = Joi.object({
    code: Joi.string().required(),
    description: Joi.string(),
    discountType: Joi.string().valid('percentage', 'fixed').required(),
    discountValue: Joi.number().required(),
    startDate: Joi.date(),
    expiryDate: Joi.date(),
});


exports.updateCouponSchema = Joi.object({
    couponId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    code: Joi.string().optional(),
    description: Joi.string(),
    discountType: Joi.string().valid('percentage', 'fixed').optional(),
    discountValue: Joi.number().optional(),
    startDate: Joi.date(),
    expiryDate: Joi.date(),
});


exports.couponIdSchema = Joi.object({
    couponId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
})
