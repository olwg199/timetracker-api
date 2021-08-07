require("dotenv").config();

const port = process.env.PORT || 5000;
const express = require("express");
const morgan = require("morgan");
const authentication = require("./api/middleware/authentication");
const cookieParser = require("cookie-parser");

const app = express();

const taskRoutes = require("./api/routes/tasks");
const userRoutes = require("./api/routes/users");

// Body parsing
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Preventing CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
});

// Routes middlware
app.use('/tasks', authentication, taskRoutes);
app.use('/user', userRoutes);

// Error handling
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