const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        match: /^[a-z0-9._]+$/i
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);