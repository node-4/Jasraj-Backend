const Joi = require('joi');
const mongoose = require('mongoose');



exports.addressSchema = Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    isDefault: Joi.boolean(),
});


exports.updateAddressSchema = Joi.object({
    fullName: Joi.string().optional(),
    phone: Joi.string().optional(),
    addressLine1: Joi.string().optional(),
    addressLine2: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    country: Joi.string().optional(),
    isDefault: Joi.boolean(),
});


exports.addressIdSchema = Joi.object({
    addressId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});