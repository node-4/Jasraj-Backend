const express = require('express');
const router = express.Router();

const auth = require('../controllers/notificationController');

const authJwt = require("../middleware/auth");

const { productImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/notifications', [authJwt.verifyToken], auth.createNotification);
    app.put('/api/user/notifications/:notificationId', [authJwt.verifyToken], auth.markNotificationAsRead);
    app.get('/api/user/notifications/user/:userId', [authJwt.verifyToken], auth.getNotificationsForUser);

}