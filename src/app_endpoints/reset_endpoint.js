"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var db = require("../database_files/database_connect").db;
app.post('/reset', function (req, res) {
    // Check the X-Authorization header for authentication if needed
    resetDatabase();
    res.status(303).set('Location', '/');
    res.end();
});
function resetDatabase() {
    var getTableNamesQuery = 'SHOW TABLES';
    db.query(getTableNamesQuery, function (err, results) {
        if (err) {
            console.error('Error retrieving table names:', err);
        }
        else {
            var tableNames = results.map(function (row) { return Object.values(row)[0]; });
            var tablesToTruncate = tableNames.filter(function (tableName) { return tableName !== 'github_token'; });
            tablesToTruncate.forEach(function (tableName) {
                var truncateTableQuery = "TRUNCATE TABLE ".concat(tableName);
                db.query(truncateTableQuery, function (err) {
                    if (err) {
                        console.error("Error truncating table ".concat(tableName, ":"), err);
                    }
                    else {
                        console.log("Table ".concat(tableName, " truncated successfully"));
                    }
                });
            });
            console.log('All tables except for "github_token" truncated successfully');
        }
    });
}
exports.default = app;
