const express = require('express');
const router = express.Router();

const auth = require('../controllers/orderController');




const authJwt = require("../middleware/auth");

const { productImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    // app.post('/api/user/checkout', [authJwt.verifyToken], auth.checkOut);
    app.post('/api/user/order', [authJwt.verifyToken], auth.createOrder);
    app.get('/api/user/order', [authJwt.verifyToken], auth.getAllOrders);
    app.get('/api/user/order/:orderId', [authJwt.verifyToken], auth.getOrderById);
    app.put('/api/user/order/:id/status', [authJwt.verifyToken], auth.updateOrderStatus);
    app.get('/api/user/history/order', [authJwt.verifyToken], auth.getOrderHistory);


}