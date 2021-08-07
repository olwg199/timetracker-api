const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const User = require("../models/user");

// [POST] /user/signup
router.post("/signup", (req, res, next) => {
    const username = req.body.username.toLowerCase();
    User.findOne({ username })
        .exec()
        .then((user) => {
            console.log(user);
            if (user) {
                res.status(409).json({
                    message: "This username is already exists."
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        const user = new User({
                            username: username,
                            password: hash
                        });
                        user
                            .save()
                            .then((result) => {
                                res.status(201).json({ meassge: "User created" })
                            })
                            .catch((err) => {
                                res.status(500).json(err);
                            });
                    }
                });
            }

        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// [POST] /user/login - login
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

module.exports = router;