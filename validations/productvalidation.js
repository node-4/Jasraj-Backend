const Joi = require('joi');
const mongoose = require('mongoose');



exports.productSchema = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    subCategoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    size: Joi.array().items(Joi.string()).required(),
    color: Joi.array().items(Joi.string()).required(),
    stock: Joi.number().required(),
});

exports.productIdSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
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


exports.subCategoryIdSchema = Joi.object({
    subCategoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.updateProductSchema = Joi.object({
    productName: Joi.string().optional(),
    description: Joi.string(),
    price: Joi.number().optional(),
    categoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .optional(),
    subCategoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .optional(),
    size: Joi.array().items(Joi.string()).optional(),
    color: Joi.array().items(Joi.string()).optional(),
    stock: Joi.number().optional(),
});


exports.createProductReviewSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
});


exports.updateProductReviewSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    reviewId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    rating: Joi.number().optional().min(1).max(5),
    comment: Joi.string().optional(),
});


exports.getAllProductReviewsSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});



exports.getProductReviewByIdSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    reviewId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.deleteProductReviewSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    reviewId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.addToWishlistSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.removeFromWishlistSchema = Joi.object({
    productId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


exports.searchSchema = Joi.object({
    search: Joi.string().min(1).max(255).required(),
});


exports.getNewArrivalProductsSchema = Joi.object({
    categoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    subcategoryId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});

