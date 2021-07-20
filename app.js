const port = process.env.PORT || 3000;
const express = require("express");

const app = express();

const taskRoutes = require("./api/routes/tasks");

app.use('/tasks', taskRoutes);

app.listen(port, function () {
    console.log("Server is running on port " + port);
});