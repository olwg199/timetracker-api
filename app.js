const port = process.env.PORT || 3000;
const express = require("express");
const morgan = require("morgan");

const app = express();

const taskRoutes = require("./api/routes/tasks");

// Body parsing
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// Logging
app.use(morgan('dev'));

// Preventing CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === "OPTIONS") {
        res.header(
            "Acces-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }

    next();
});

// Routes middlware
app.use('/tasks', taskRoutes);

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