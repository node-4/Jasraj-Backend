const SubCategory = require('../models/subCategoryModel');
const Category = require('../models/categoryModel');


const { subCategorySchema, subCategoryIdSchema, updateSubCategorySchema } = require('../validations/subCategoryValidation');



exports.createSubCategory = async (req, res) => {
    try {
        const { category, name } = req.body;

        const { error } = subCategorySchema.validate({ category, name });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const categories = await Category.findById(category)

        if (!categories) {
            return res.status(404).json({ status: 404, message: "categories not found" });

        }

        const subcategory = new SubCategory({
            category,
            name,
            image: req.file.path,
        });

        await subcategory.save();

        return res.status(201).json({ status: 201, message: 'Subcategory created successfully', data: subcategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Subcategory creation failed', error: error.message });
    }
};


exports.getAllSubCategories = async (req, res) => {
    try {
        const subcategories = await SubCategory.find();
        return res.status(200).json({ status: 200, data: subcategories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching subcategories', error: error.message });
    }
};


exports.getAllSubCategoriesforAdmin = async (req, res) => {
    try {
        const subcategories = await SubCategory.find();
        return res.status(200).json({ status: 200, data: subcategories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching subcategories', error: error.message });
    }
};


exports.getSubCategoryById = async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;

        const { error } = subCategoryIdSchema.validate({ subcategoryId });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const subcategory = await SubCategory.findById(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ status: 404, message: 'Subcategory not found' });
        }

        return res.status(200).json({ status: 200, data: subcategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching subcategory by ID', error: error.message });
    }
};


exports.updateSubCategory = async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        const { category, name } = req.body

        const { error } = updateSubCategorySchema.validate({ subcategoryId, category, name });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const subCategories = await SubCategory.findById(subcategoryId)

        if (!subCategories) {
            return res.status(404).json({ status: 404, message: "subCategories not found" });
        }

        if (category) {
            const categories = await Category.findById(req.body.category)
            if (!categories) {
                return res.status(404).json({ status: 404, message: "categories not found" });
            }
        }

        const updatedSubcategory = await SubCategory.findByIdAndUpdate(subcategoryId, { ...req.body, image: req.file.path, }, { new: true });

        if (!updatedSubcategory) {
            return res.status(404).json({ status: 404, message: 'Subcategory not found' });
        }

        return res.status(200).json({ status: 200, message: 'Subcategory updated successfully', data: updatedSubcategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Subcategory update failed', error: error.message });
    }
};


exports.deleteSubCategory = async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;

        const { error } = subCategoryIdSchema.validate({ subcategoryId });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const deletedSubcategory = await SubCategory.findByIdAndDelete(subcategoryId);

        if (!deletedSubcategory) {
            return res.status(404).json({ status: 404, message: 'Subcategory not found' });
        }

        return res.status(200).json({ status: 200, message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Subcategory deletion failed', error: error.message });
    }
};


