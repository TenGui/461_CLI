"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql2");
var db = mysql.createConnection({
    host: "publicdb.cvr1hbjvaden.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "project461",
    database: "testdb",
});
db.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("DB connected");
    // Execute a SELECT query to retrieve data from the table
    var selectQuery = "SELECT * FROM your_table_name"; // Replace with your table name
    db.query(selectQuery, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        // Process and display the retrieved data
        console.log("Data from the database:");
        console.log(results);
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
