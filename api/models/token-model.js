const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Token", tokenSchema);