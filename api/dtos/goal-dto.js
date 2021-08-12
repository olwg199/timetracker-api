module.exports = class GoalDto {
    id;
    title;
    time;
    frequency;
    datesAchieved;
    isActive;
    description;

    constructor(model) {
        this.id = model._id;
        this.title = model.title;
        this.time = model.time;
        this.frequency = model.frequency;
        this.datesAchieved = model.datesAchieved;
        this.isActive = model.isActive;
        this.description = model.description;
    }
}