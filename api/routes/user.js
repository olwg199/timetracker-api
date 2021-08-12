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

const User = require("../models/user-model");

// [POST] /user/signup
router.post("/signup", UserController.signup);

// [POST] /user/login
router.post("/login", UserController.login);

// [POST] /user/logout
router.post("/logout", UserController.logout);

// [POST] /user/refresh
router.get("/refresh", UserController.refresh)

// [POST] /user/activate/:link
router.post("/activate/:link", UserController.activate);

module.exports = router;