require("dotenv").config();

const port = process.env.PORT || 5000;
const express = require("express");
const morgan = require("morgan");
const authentication = require("./api/middleware/authentication");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const taskRoutes = require("./api/routes/tasks");
const userRoutes = require("./api/routes/users");
const error = require("./api/middleware/error");

// Body parsing
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Preventing CORS errors
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

// Routes middlware
app.use('/tasks', authentication, taskRoutes);
app.use('/user', userRoutes);

// Error handling
app.use(error);

app.listen(port, function () {
    console.log("Server is running on port " + port);
});