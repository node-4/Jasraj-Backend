const express = require('express');
const router = express.Router();

const auth = require('../controllers/paymentController');



const authJwt = require("../middleware/auth");

const { productImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/payment/create', [authJwt.verifyToken], auth.createPayment);
    app.get('/api/user/payment', [authJwt.verifyToken], auth.getPayments);
    app.get('/api/user/payment/:paymentId', [authJwt.verifyToken], auth.getPaymentDetails);
    app.put('/api/user/payment/:paymentId', [authJwt.verifyToken], auth.updatePaymentStatus);
    app.delete('/api/user/payment/:paymentId', [authJwt.verifyToken], auth.deletePayment);
    app.get('/api/user/orders/track/:trackingNumber', [authJwt.verifyToken], auth.trackOrder);


}