const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    description: {
        type: String,
    },
    image: [
        {
            url: {
                type: String,
            }
        },
    ],
    price: {
        type: Number,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    subCategoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            name: {
                type: String,
            },
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
        },
    ],
    numOfReviews: {
        type: Number,
        default: 0,
    },
    size: [
        {
            type: String,
        },
    ],
    color: [
        {
            type: String,
        },
    ],
    stock: {
        type: Number,
    },

}, { timestamps: true });


productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
