const Joi = require('joi');
const mongoose = require('mongoose');



exports.categorySchema = Joi.object({
    name: Joi.string().required(),
});


exports.categoryIdSchema = Joi.object({
    categoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.updateCategorySchema = Joi.object({
    categoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    name: Joi.string().optional(),
});
