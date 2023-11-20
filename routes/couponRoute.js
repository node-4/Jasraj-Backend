const express = require('express');
const router = express.Router();

const auth = require('../controllers/couponController');



const authJwt = require("../middleware/auth");

const { couponImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/coupon', [authJwt.verifyToken], couponImage.single('image'), auth.createCoupon);
    app.get('/api/user/coupon', [authJwt.verifyToken], auth.getAllCoupons);
    app.get('/api/user/forAdminCoupon', /*[authJwt.verifyToken],*/ auth.getAllCouponsForAdmin);
    app.get('/api/user/coupon/:couponId', [authJwt.verifyToken], auth.getCouponById);
    app.put('/api/user/coupon/:couponId', [authJwt.verifyToken], couponImage.single('image'), auth.updateCoupon);
    app.get('/api/user/coupons/active', [authJwt.verifyToken], auth.getActiveCoupons);
    app.delete('/api/user/coupon/:couponId', [authJwt.verifyToken], auth.deleteCoupon);

}