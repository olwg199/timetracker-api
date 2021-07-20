const express = require("express");
const router = express.Router();

// [GET] /tasks/
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "First GET route"
    });
});

// [POST] /tasks/
router.post("/", (req, res, next) => {
    const task = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        time: req.body.time,
        description: req.body.description
    };

    res.status(201).json({
        message: "First POST route",
        createdTask: task
    });
});

// [GET] /tasks/{taskId}
router.get("/:taskId", (req, res, next) => {
    const id = req.params.taskId;
    if (id === "special") {
        res.status(200).json({
            message: "First POST route",
            id: id
        });
    } else {
        res.status(200).json({
            message: "You passed an ID",
            id: id
        });
    }
});

// [PATCH] /tasks/{taskId}
router.patch("/:taskId", (req, res, next) => {
    const id = req.params.taskId;

    res.status(200).json({
        message: "Updated product",
        id: id
    });
});

// [DELETE] /tasks/{taskId}
router.delete("/:taskId", (req, res, next) => {
    const id = req.params.taskId;

    res.status(200).json({
        message: "Deleted product",
        id: id
    });
});

module.exports = router;