const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
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
        type: [Date]
    },
    isActive: {
        type: Boolean,
        required: true
    },
    description: String
});

module.exports = mongoose.model("Task", taskSchema);