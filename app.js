const port = process.env.PORT || 3000;
const express = require("express");
const morgan = require("morgan");

const app = express();

const taskRoutes = require("./api/routes/tasks");

// Logging
app.use(morgan('dev'));

app.use('/tasks', taskRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

app.listen(port, function () {
    console.log("Server is running on port " + port);
});