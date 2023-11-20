const express = require('express');
const router = express.Router();

const auth = require('../controllers/subCategoryController');



const authJwt = require("../middleware/auth");

const { subCategoryImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/subcategories', [authJwt.verifyToken], subCategoryImage.single('image'), auth.createSubCategory);
    app.get('/api/user/subcategories', [authJwt.verifyToken], auth.getAllSubCategories);
    app.get('/api/user/forAdminSubcategories', /*[authJwt.verifyToken],*/ auth.getAllSubCategoriesforAdmin);
    app.get('/api/user/subcategories/:subcategoryId', [authJwt.verifyToken], auth.getSubCategoryById);
    app.put('/api/user/subcategories/:subcategoryId', [authJwt.verifyToken], subCategoryImage.single('image'), auth.updateSubCategory);
    app.delete('/api/user/subcategories/:subcategoryId', [authJwt.verifyToken], auth.deleteSubCategory);


}