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
        .select('_id title frequency time datesAchieved isActive description')
        .exec()
        .then(tasks => {
            res.status(200).json({
                count: tasks.length,
                tasks: tasks.map(task => {
                    return {
                        ...task._doc,
                        request: [
                            {
                                type: "GET",
                                url: `${process.env.SERVER_ADDRESS}/tasks/${task._id}`
                            },
                            {
                                type: "DELETE",
                                url: `${process.env.SERVER_ADDRESS}/tasks/${task._id}`
                            }
                        ]
                    };
                })
            });
        })
        .catch(err => res.status(500).json({ error: err }));
});

// [POST] /tasks/
router.post("/", (req, res, next) => {
    const task = new Task({
        title: req.body.title,
        time: req.body.time,
        frequency: req.body.frequency,
        datesAchieved: [],
        isActive: req.body.isActive,
        description: req.body.description
    });

    task.save()
        .then(task => {
            res.status(201).json({
                message: "Created task successfully",
                createdTask: {
                    ...task._doc,
                    request: [
                        {
                            type: "GET",
                            url: `${process.env.SERVER_ADDRESS}/tasks/${task._id}`
                        },
                        {
                            type: "DELETE",
                            url: `${process.env.SERVER_ADDRESS}/tasks/${task._id}`
                        }
                    ]
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
        .select("_id title frequency time datesAchieved isActive description")
        .exec()
        .then(task => {
            if (task) {
                res.status(200).json({
                    task: {
                        ...task._doc,
                        requests: [
                            {
                                type: "GET",
                                description: "Get list of tasks",
                                url: `${process.env.SERVER_ADDRESS}/tasks`
                            },
                            {
                                type: "DELETE",
                                url: `${process.env.SERVER_ADDRESS}/tasks/${task._id}`
                            }
                        ]
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
                    url: `${process.env.SERVER_ADDRESS}/tasks/${id}`
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
                        url: `${process.env.SERVER_ADDRESS}/tasks/`
                    }
                })
            }
        })
        .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;