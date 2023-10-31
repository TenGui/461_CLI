"use strict";
// databaseEndpoint.ts
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var database_connect_1 = require("../database_files/database_connect");
app.get('/database', function (req, res) {
    // Connect to the database
    database_connect_1.db.connect(function (err) {
        if (err) {
            console.log(err);
            res.send("Failed to connect to the database.");
            return;
        }
        // Execute a SELECT query to retrieve data from the table
        var selectQuery = "SELECT * FROM your_table_name"; // Replace with your table name
        database_connect_1.db.query(selectQuery, function (err, results) {
            if (err) {
                console.log(err);
                res.send("Failed to retrieve data from the database.");
                return;
            }
            // Process and display the retrieved data
            var data = JSON.stringify(results); // Convert data to JSON
            res.send(data);
        });
    });
});
exports.default = app;
