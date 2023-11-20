const express = require('express');
const router = express.Router();

const auth = require('../controllers/addressController');


const authJwt = require("../middleware/auth");

const { productImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/address', [authJwt.verifyToken], auth.createAddress);
    app.put('/api/user/address/:addressId', [authJwt.verifyToken], auth.updateAddress);
    app.get('/api/user/address', [authJwt.verifyToken], auth.getAddresses);
    app.get('/api/user/address/:addressId', [authJwt.verifyToken], auth.getAddressById);
    app.delete('/api/user/address/:addressId', [authJwt.verifyToken], auth.deleteAddress);

}