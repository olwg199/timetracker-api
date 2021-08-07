const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const User = require("../models/user");

exports.signup = (req, res, next) => {
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
};