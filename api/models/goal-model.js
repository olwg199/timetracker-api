const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    datesAchieved: {
        type: [Date],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: String
});

module.exports = mongoose.model("Goal", goalSchema);