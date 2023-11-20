const express = require('express');
const router = express.Router();
const auth = require('../controllers/categoryController');



const authJwt = require("../middleware/auth");

const { categoryImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/categories', [authJwt.verifyToken], categoryImage.single('image'), auth.createCategory);
    app.get('/api/user/categories', [authJwt.verifyToken], auth.getAllCategories);
    app.get('/api/user/forAdminCategories', /*[authJwt.verifyToken],*/ auth.getAllCategoriesForAdmin);
    app.get('/api/user/categories/:categoryId', [authJwt.verifyToken], auth.getCategoryById);
    app.put('/api/user/categories/:categoryId', [authJwt.verifyToken], categoryImage.single('image'), auth.updateCategory);
    app.delete('/api/user/categories/:categoryId', [authJwt.verifyToken], auth.deleteCategory);


}