const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: String,
    startDate: Date,
    endDate: Date,
    time: Number,
    description: String
});

module.exports = mongoose.model("Task", taskSchema);