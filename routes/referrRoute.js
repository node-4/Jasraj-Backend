const express = require('express');
const router = express.Router();

const referralController = require('../controllers/refferController');

const authJwt = require("../middleware/auth");

const { subCategoryImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/referral', referralController.createReferral);
    app.put('/api/user/referral/:referralId', referralController.updateReferralStatus);
    app.get('/api/user/referrals', referralController.getAllReferrals);
    app.get('/api/user/referrals/:referralId', referralController.getReferralById);
    app.delete('/api/user/referrals/:referralId', referralController.deleteReferral);




}