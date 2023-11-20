const express = require('express');
const router = express.Router();
const auth = require('../controllers/cartController');



const authJwt = require("../middleware/auth");

const { productImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/cart/add', [authJwt.verifyToken], auth.addToCart);
    app.get('/api/user/cart/get', [authJwt.verifyToken], auth.getCart);
    app.put('/api/user/cart/update', [authJwt.verifyToken], auth.updateCart);
    app.delete('/api/user/cart/delete', [authJwt.verifyToken], auth.deleteCart);
    app.put('/api/user/cart/updateQuantity', [authJwt.verifyToken], auth.updateCartQuantity);
    app.delete('/api/user/cart/products/:productId', [authJwt.verifyToken], auth.deleteCartProductById);
    app.post('/api/user/cart/apply-coupon', [authJwt.verifyToken], auth.applyCouponToCart);
    app.put('/api/user/cart/update-apply-coupon', [authJwt.verifyToken], auth.updateCartCoupon);
    app.delete('/api/user/cart/delete-apply-coupon', [authJwt.verifyToken], auth.removeCartCoupon);

}