const Category = require('../models/categoryModel');

const { categorySchema, categoryIdSchema, updateCategorySchema } = require('../validations/categoryValidation');




exports.createCategory = async (req, res) => {
    try {
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const { name } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const category = new Category({
            name,
            image: req.file.path,
        });

        await category.save();

        return res.status(201).json({ status: 201, message: 'Category created successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Category creation failed', error: error.message });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ status: 200, data: categories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching categories', error: error.message });
    }
};


exports.getAllCategoriesForAdmin = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ status: 200, data: categories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching categories', error: error.message });
    }
};


exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const { error } = categoryIdSchema.validate({ categoryId });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Category not found' });
        }

        return res.status(200).json({ status: 200, data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching category', error: error.message });
    }
};


exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const { name } = req.body;

        const { error } = updateCategorySchema.validate({ categoryId, name });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const category = await Category.findByIdAndUpdate(categoryId, { name, image: req.file.path, }, { new: true });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Category not found' });
        }

        return res.status(200).json({ status: 200, message: 'Category updated successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Category update failed', error: error.message });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const { error } = categoryIdSchema.validate({ categoryId });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Category not found' });
        }

        return res.status(200).json({ status: 200, message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Category deletion failed', error: error.message });
    }
};