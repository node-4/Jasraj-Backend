const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
    }, name: {
        type: String,
    },
    image: {
        type: String,
    },
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
