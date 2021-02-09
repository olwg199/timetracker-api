const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.route("/").get(
    function(req,res) {
        res.send("Hello");
    }
)

app.listen(3000, function(){
    console.log("Server is running on port 3000.")
});