const auth = require("../controllers/userController");
const express = require("express");
const router = express()


const authJwt = require("../middleware/auth");

const { profileImage } = require('../middleware/imageUpload');



module.exports = (app) => {

    // api/user/

    app.post('/api/user/register', auth.register);
    app.post('/api/user/verify/:userId', auth.verifyOTP);
    app.post('/api/user/login/:userId', auth.login)
    app.post('/api/user/resend/:userId', auth.resendOTP);
    app.get('/api/user/users', auth.getAllUsers);
    app.get('/api/user/users/:userId', auth.getUserById)
    app.put('/api/user/update', [authJwt.verifyToken], auth.updateProfile);
    app.put('/api/user/upload-profile-picture', [authJwt.verifyToken], profileImage.single('image'), auth.uploadProfilePicture);

}