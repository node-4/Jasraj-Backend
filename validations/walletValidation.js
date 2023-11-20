const Joi = require('joi');
const mongoose = require('mongoose');



exports.walletBalanceSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.updateWalletBalanceSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    amount: Joi.number().positive().required(),
});