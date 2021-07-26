const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    description: String
});

module.exports = mongoose.model("Task", taskSchema);