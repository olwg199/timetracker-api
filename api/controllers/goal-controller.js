const goalService = require("../services/goal-service");

class GoalController {
    async getGoals(req, res, next) {
        try {
            const goals = await goalService.getGoals();

            return res.status(200).json({
                length: goals.length,
                goals: goals.map((goal) => {
                    return {
                        goal,
                        request: [
                            {
                                type: "GET",
                                url: `${process.env.SERVER_ADDRESS}/goals/${goal.id}`
                            },
                            {
                                type: "DELETE",
                                url: `${process.env.SERVER_ADDRESS}/goals/${goal.id}`
                            }
                        ]
                    }
                })
            });
        } catch (e) {
            next(e);
        }
    };

    async getGoalById(req, res, next) {
        try {
            const goal = await goalService.getGoalById(req.params.goalId);
            return res.json({
                goal,
                requests: [
                    {
                        type: "GET",
                        description: "Get list of goals",
                        url: `${process.env.SERVER_ADDRESS}/goals`
                    },
                    {
                        type: "DELETE",
                        url: `${process.env.SERVER_ADDRESS}/goals/${goal.id}`
                    }
                ]
            });
        } catch (e) {
            next(e);
        }
    };

    async createGoal(req, res, next) {
        try {
            console.log(`Controller: ${req.body}`);
            const goal = await goalService.createGoal(req.body);
            return res.status(201).json({
                message: "Created goal successfully",
                createdGoal: {
                    goal,
                    request: [
                        {
                            type: "GET",
                            url: `${process.env.SERVER_ADDRESS} /goals/${goal.id} `
                        },
                        {
                            type: "DELETE",
                            url: `${process.env.SERVER_ADDRESS} /goals/${goal.id} `
                        }
                    ]
                }
            });
        } catch (e) {
            next(e);
        }
    };

    async updateGoal(req, res, next) {
        try {
            const goalId = req.params.goalId;
            await goalService.updateGoal(goalId, req.body);

            return res.status(200).json({
                message: "Goal updated successfully",
                request: {
                    type: "GET",
                    url: `${process.env.SERVER_ADDRESS}/goals/${goalId} `
                }
            });
        } catch (e) {
            next(e);
        }
    };

    async deleteGoal(req, res, next) {
        try {
            const goals = await goalService.deleteGoalById(req.params.goalId);

            return res.status(200).json({
                message: "Goal deleted successfully",
                request: {
                    type: "GET",
                    description: "See list of goals",
                    url: `${process.env.SERVER_ADDRESS}/goals/`
                }
            });;
        } catch (e) {
            next(e);
        }
    };
}

module.exports = new GoalController();