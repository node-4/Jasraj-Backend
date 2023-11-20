const express = require('express');
const router = express.Router();
const auth = require('../controllers/offerController');



const authJwt = require("../middleware/auth");

const { offerImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/offers', [authJwt.verifyToken], offerImage.single('image'), auth.createOffer);
    app.get('/api/user/offers', [authJwt.verifyToken], auth.getAllOffers);
    app.get('/api/user/forAdminOffers', /*[authJwt.verifyToken],*/ auth.getAllOffersForAdmin);
    app.get('/api/user/offers/:offerId', [authJwt.verifyToken], auth.getOfferById);
    app.put('/api/user/offers/:offerId', [authJwt.verifyToken], offerImage.single('image'), auth.updateOffer);
    app.delete('/api/user/offers/:offerId', [authJwt.verifyToken], auth.deleteOffer);

}