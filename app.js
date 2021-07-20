const port = process.env.PORT || 3000;
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.route("/").get(
    function(req,res) {
        res.status(200).json({
            message: "Hello! It works."
        });
    }
)

app.listen(port, function(){
    console.log("Server is running on port " + port);
});