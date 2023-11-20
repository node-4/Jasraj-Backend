const express = require('express');
const router = express.Router();

const auth = require('../controllers/walletController');



const authJwt = require("../middleware/auth");

const { productImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/:userId/wallet', [authJwt.verifyToken], auth.createUserWallet);
    app.put('/api/user/:userId/wallet', [authJwt.verifyToken], auth.updateWalletBalance);
    app.get('/api/user/:userId/wallet', [authJwt.verifyToken], auth.getWalletBalance);
    app.delete('/api/user/:userId/wallet', [authJwt.verifyToken], auth.deleteWallet);


}