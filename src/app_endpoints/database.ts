// databaseEndpoint.ts

const express = require('express');
const app = express();
import * as mysql from "mysql2";
import { db } from "../database_files/database_connect";

app.get('/database', (req, res) => {
    // Connect to the database
    db.connect((err) => {
        if (err) {
            console.log(err);
            res.send("Failed to connect to the database.");
            return;
        }

        // Execute a SELECT query to retrieve data from the table
        const selectQuery = "SELECT * FROM your_table_name"; // Replace with your table name

        db.query(selectQuery, (err, results) => {
            if (err) {
                console.log(err);
                res.send("Failed to retrieve data from the database.");
                return;
            }

            // Process and display the retrieved data
            const data = JSON.stringify(results); // Convert data to JSON
            res.send(data);


        });
    });
});

export default app;
