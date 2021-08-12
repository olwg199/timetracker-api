const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const GoalController = require("../controllers/goal-controller");

mongoose.connect(
    process.env.MONGO_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// [GET] /goals/
router.get("/", GoalController.getGoals);

// [POST] /goals/
router.post("/", GoalController.createGoal);

// [GET] /goals/{goalId}
router.get("/:goalId", GoalController.getGoalById);

// [PATCH] /goals/{goalId}
router.patch("/:goalId", GoalController.updateGoal);

// [DELETE] /goals/{goalId}
router.delete("/:goalId", GoalController.deleteGoal);

module.exports = router;