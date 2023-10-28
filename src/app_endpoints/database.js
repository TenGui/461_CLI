"use strict";
// databaseEndpoint.ts
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var mysql = require("mysql2");
var db = mysql.createConnection({
    host: "publicdb.cvr1hbjvaden.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "project461",
    database: "testdb",
});
app.get('/database', function (req, res) {
    // Connect to the database
    db.connect(function (err) {
        if (err) {
            console.log(err);
            res.send("Failed to connect to the database.");
            return;
        }
        // Execute a SELECT query to retrieve data from the table
        var selectQuery = "SELECT * FROM your_table_name"; // Replace with your table name
        db.query(selectQuery, function (err, results) {
            if (err) {
                console.log(err);
                res.send("Failed to retrieve data from the database.");
                return;
            }
            // Process and display the retrieved data
            var data = JSON.stringify(results); // Convert data to JSON
            res.send(data);
            // Close the database connection when done
            db.end(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("DB connection closed");
            });
        });
    });
});
exports.default = app;
