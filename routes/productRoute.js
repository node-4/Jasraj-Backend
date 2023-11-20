const express = require('express');
const router = express.Router();

const auth = require('../controllers/productController');



const authJwt = require("../middleware/auth");

const { productImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/products', [authJwt.verifyToken], productImage.array('image'), auth.createProduct);
    app.get('/api/user/products', [authJwt.verifyToken], auth.getAllProducts);
    app.get('/api/user/productsByAdmin', /*[authJwt.verifyToken],*/ auth.getAllProductsByAdmin);
    app.get('/api/user/products/:productId', [authJwt.verifyToken], auth.getProductById);
    app.get('/api/user/forAdminProducts/:productId', /*[authJwt.verifyToken],*/ auth.forAdminGetProductById);
    app.put('/api/user/products/:productId', [authJwt.verifyToken], productImage.array('image'), auth.updateProduct);
    app.delete('/api/user/products/:productId', [authJwt.verifyToken], auth.deleteProduct);
    app.post('/api/user/products/:productId/reviews', [authJwt.verifyToken], auth.createProductReview);
    app.get('/api/user/products/:productId/reviews', [authJwt.verifyToken], auth.getAllProductReviews);
    app.get('/api/user/products/:productId/reviews/:reviewId', [authJwt.verifyToken], auth.getProductReviewById);
    app.put('/api/user/products/:productId/reviews/:reviewId', [authJwt.verifyToken], auth.updateProductReview);
    app.delete('/api/user/products/:productId/reviews/:reviewId', [authJwt.verifyToken], auth.deleteProductReview);
    app.post('/api/user/products/wishlist/:productId', [authJwt.verifyToken], auth.addToWishlist);
    app.get('/api/user/product/wishlist', [authJwt.verifyToken], auth.getMyWishlist);
    app.delete('/api/user/products/wishlist/:productId', [authJwt.verifyToken], auth.removeFromWishlist);
    app.get('/api/user/products/category/:categoryId', [authJwt.verifyToken], auth.getProductsByCategory);
    app.get('/api/user/products/subCategoryId/:subCategoryId', [authJwt.verifyToken], auth.getProductsBySubCategory);
    app.get('/api/user/product/search', [authJwt.verifyToken], auth.searchProducts);
    app.get('/api/user/category/:categoryId/subcategory/:subcategoryId/new-arrivals', [authJwt.verifyToken], auth.getNewArrivalProductsByCategoryAndSubCategory)
    app.get('/api/user/new-arrivals', [authJwt.verifyToken], auth.getNewArrivalProducts);
    app.get('/api/user/forAdminNew-arrivals', /*[authJwt.verifyToken],*/ auth.getNewArrivalProductsforADmin);
    app.get('/api/user/most-demanded', [authJwt.verifyToken], auth.getMostDemandedProducts);
    app.get('/api/user/forAdminMost-demanded', /*[authJwt.verifyToken],*/ auth.getMostDemandedProductsforAdmin);
    app.get("/api/user/product/all/paginateProductSearch", [authJwt.verifyToken], auth.paginateProductSearch);



}