const GoalDto = require("../dtos/goal-dto");

const Goal = require("../models/goal-model");
const ApiError = require("../exceptions/api-error");

class GoalService {
    async getGoals() {
        const goals = await Goal.find();
        return goals.map((goal) => {
            return new GoalDto(goal);
        });
    };

    async getGoalById(id) {
        if (!id) {
            throw ApiError.BadRequest("Missing id.")
        }

        const goal = await Goal.findById(id);

        if (!goal) {
            throw ApiError.InvalidId("Invalid goal id.");
        }

        return goal;
    };

    async createGoal(goal) {
        try {
            console.log(`Service: ${goal}`);
            const newGoal = await new Goal({ ...goal }).save();

            return new GoalDto(newGoal);
        } catch (e) {
            if (e.name === "ValidationError") {
                const fields = Object.keys(e.errors);
                const missingFields = fields;
                throw ApiError.ValidationError(`These fields are required: ${fields.join(", ")}.`, e.errors);
            }
            throw e;
        }
    };

    async updateGoal(id, updateOps) {
        try {
            if (!id) throw ApiError.IvalidId("Id is required to update goal.");

            await Goal.updateOne({ _id: id }, { $set: updateOps });
        } catch (e) {
            if (e.name === "ValidationError") {
                const fields = Object.keys(e.errors);
                const missingFields = fields;
                throw ApiError.ValidationError(`These fields are required: ${fields.join(", ")}.`, e.errors);
            }
            throw e;
        }
    };

    async deleteGoalById(id) {
        try {
            if (!id) throw ApiError.IvalidId("Id is required to delete goal.");

            await Goal.deleteOne({ _id: id });
        } catch (e) {
            throw e;
        }
    };
}

module.exports = new GoalService();