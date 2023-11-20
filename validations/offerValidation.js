const mongoose = require('mongoose');
const Joi = require('joi');



exports.createOfferSchema = Joi.object({
    product: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    code: Joi.string().trim().required(),
    discountPercentage: Joi.number().required(),
    validFrom: Joi.date().required(),
    validTo: Joi.date().required(),
});


exports.updateOfferSchema = Joi.object({
    offerId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    product: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    code: Joi.string().trim().optional(),
    discountPercentage: Joi.number().optional(),
    validFrom: Joi.date().optional(),
    validTo: Joi.date().optional(),
});


