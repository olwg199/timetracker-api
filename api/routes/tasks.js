const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect(
    'mongodb://localhost:27017/timetracker',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const Task = require("../models/task");

// [GET] /tasks/
router.get("/", (req, res, next) => {
    Task.find()
        .exec()
        .then(docs => res.status(200).json(docs))
        .catch(err => res.status(500).json({ error: err }));
});

// [POST] /tasks/
router.post("/", (req, res, next) => {
    const task = new Task({
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        time: req.body.time,
        description: req.body.description
    });

    task.save()
        .then(result => {
            res.status(201).json({
                message: "First POST route",
                createdTask: task
            })
        })
        .catch(err => {
            res.status(404).json({ error: err })
        });
});

// [GET] /tasks/{taskId}
router.get("/:taskId", (req, res, next) => {
    const id = req.params.taskId;

    Task.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "No valid entry found for provided Id" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// [PATCH] /tasks/{taskId}
router.patch("/:taskId", (req, res, next) => {
    const id = req.params.taskId;
    const updateOps = {};
    console.log(req.body);
    for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body["ops"];
    }

    Task.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

    res.status(200).json({
        message: "Updated product",
        id: id
    });
});

// [DELETE] /tasks/{taskId}
router.delete("/:taskId", (req, res, next) => {
    const id = req.params.taskId;

    Task.remove({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount === 0) {
                res.status(404).json({ message: "No valid entry found for provided Id" });
            } else {
                res.status(200).json(result)
            }
        })
        .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;