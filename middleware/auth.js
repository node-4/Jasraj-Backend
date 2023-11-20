const authConfig = require("../configs/auth.config");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");



const verifyToken = (req, res, next) => {
    const token =
        req.get("Authorization")?.split("Bearer ")[1] ||
        req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({
            message: "No token provided! Access prohibited",
        });
    } else {
        jwt.verify(token, authConfig.secret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized!", });
            }
            try {
                const user = await User.findOne({ _id: decoded._id });
                if (!user) {
                    return res.status(400).json({
                        message: "The user that this token belongs to does not exist",
                    });
                }
                req.user = user;
                next();
            } catch (error) {
                return res.status(500).json({
                    message: "Internal server error",
                });
            }
        });
    }
};


const isAdmin = (req, res, next) => {
    const token =
        req.headers["x-access-token"] ||
        req.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
        return res.status(403).send({
            message: "No token provided! Access prohibited",
        });
    }

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized! Admin role is required!",
            });
        }

        try {
            const user = await User.findOne({ _id: decoded._id });

            if (!user) {
                return res.status(400).send({
                    message: "The user that this token belongs to does not exist",
                });
            }

            if (user.userType !== "Admin") {
                return res.status(403).send({
                    message: "Access prohibited. Admin role is required!",
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};




module.exports = {
    verifyToken,
    isAdmin,
};