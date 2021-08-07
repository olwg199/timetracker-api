const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = require("../controllers/user-controller");

mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const User = require("../models/user");

// [POST] /user/signup
router.post("/signup", UserController.signup);

// [POST] /user/login
router.post("/login", (req, res, next) => {
    const username = req.body.username.toLowerCase();
    User.findOne({ username })
        .exec()
        .then((user) => {
            console.log(user);
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({ username: user.username, userId: user._id },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "7d"
                            });
                        res.status(200).json({
                            message: "Login was successfull.",
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            message: "Invalid username or password!"
                        });
                    }
                });
            } else {
                res.status(404).json({
                    message: "Invalid username or password!"
                });
            }

        })
        .catch((err) => {
            res.status(500).json(err);
        });

});

// [POST] /user/logout
router.post("/logout");

// [POST] /user/activate/:link
router.post("/activate/:link");

// [POST] /user/refresh
router.post("/refresh")

module.exports = router;