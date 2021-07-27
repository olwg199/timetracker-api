const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const Task = require("../models/task");

// [GET] /tasks/
router.get("/", (req, res, next) => {
    Task.find()
        .select('_id title startDate endDate time description')
        .exec()
        .then(tasks => {
            res.status(200).json({
                count: tasks.length,
                tasks: tasks.map(task => {
                    return {
                        _id: task._id,
                        title: task.title,
                        startDate: task.startDate,
                        endDate: task.endDate,
                        time: task.time,
                        description: task.description,
                        request: {
                            type: "GET",
                            url: `${process.env.SERVER_ADDRESS}:${process.env.PORT}/tasks/${task._id}`
                        }
                    }
                })
            });
        })
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
        .then(task => {
            res.status(201).json({
                message: "Created task successfully",
                createdTask: {
                    _id: task._id,
                    title: task.title,
                    startDate: task.startDate,
                    endDate: task.endDate,
                    time: task.time,
                    description: task.description,
                    request: {
                        type: "GET",
                        url: `${process.env.SERVER_ADDRESS}:${process.env.PORT}/tasks/${task._id}`
                    }
                }
            });
        })
        .catch(err => {
            res.status(404).json({ error: err })
        });
});

// [GET] /tasks/{taskId}
router.get("/:taskId", (req, res, next) => {
    const id = req.params.taskId;

    Task.findById(id)
        .select("_id title startDate endDate time description")
        .exec()
        .then(task => {
            if (task) {
                res.status(200).json({
                    task: task,
                    request: {
                        type: "GET",
                        description: "Get list of tasks",
                        url: `${process.env.SERVER_ADDRESS}:${process.env.PORT}/tasks/`
                    }
                });
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
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Task.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(task => {
            res.status(200).json({
                message: "Task updated successfully",
                request: {
                    type: "GET",
                    url: `${process.env.SERVER_ADDRESS}:${process.env.PORT}/tasks/${id}`
                }
            })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// [DELETE] /tasks/{taskId}
router.delete("/:taskId", (req, res, next) => {
    const id = req.params.taskId;

    Task.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount === 0) {
                res.status(404).json({ message: "No valid entry found for provided Id" });
            } else {
                res.status(200).json({
                    message: "Task deleted successfully",
                    request: {
                        type: "GET",
                        description: "See list of tasks",
                        url: `${process.env.SERVER_ADDRESS}:${process.env.PORT}/tasks/`
                    }
                })
            }
        })
        .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;