
/**
Authors: David Gonzales and Grace Kaylor
File: index_service.js
This program acts as the service for our main planner. This program
handles users posting new assignments on the planner and saving them
to a text file using a POST. Assignments are posted with commas separating the content
and a new line is added at the end to make looping easier. The program also retrieves
the assignments from the text file using a GET when the user clicks a button to refresh
their planner. It parses the file on new lines then splits the lines on commas, and
passes back the information in json that is easy to work with.
*/

(function() {
    "use strict";

    const express = require("express");
    const app = express();
    const fs = require("fs");

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(express.static('public'));

    // gets the information
    app.get('/', function (req, res) {
        let json = {};
        let assignmentFile = [];

        let file = fs.readFileSync("assignments.txt", 'utf8');

        let fileLines = file.split("\n");
        // saves the information for each comment
        for(let k = 0; k < fileLines.length; k++) {
            let assignment = {};
            let line = fileLines[k].split(",");
            assignment["date"] = line[0];
            assignment["classes"] = line[1];
            assignment["assignment"] = line[2];
            assignmentFile.push(assignment);
        }
        json["assignments"] = assignmentFile;
        res.send(JSON.stringify(json));
    });

    const bodyParser = require('body-parser');
    const jsonParser = bodyParser.json();

    // posts the information
    app.post('/', jsonParser, function (req, res) {
        const date = req.body.date;
        const assignment = req.body.assignment;
        const classes = req.body.classes;
        // add a new line at the end of each assignment added
        let appendPost = date + "," + classes + "," + assignment + "\n";

        fs.appendFile("assignments.txt", appendPost, function(err) {
            if(err) {
                return console.log(err);
            }
            res.send("The file was saved!");
        });
    });

app.listen(process.env.PORT);

})();
