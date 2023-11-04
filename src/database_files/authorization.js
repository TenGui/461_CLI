"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
var database_connect_1 = require("./database_connect");
var axios = require('axios');
var Helper = /** @class */ (function () {
    function Helper() {
        this.dbConnection = database_connect_1.db;
    }
    Helper.prototype.setEnvVariables = function () {
        var query = "SELECT value FROM github_token WHERE id = 1";
        this.dbConnection.query(query, [1], function (err, results) {
            if (err) {
                console.error("Error retrieving value from 'github_token':", err);
                return;
            }
            var rows = results;
            if (rows.length === 1) {
                var githubToken = rows[0].value;
                console.log("Retrieved GitHub token value}");
                process.env.GITHUB_TOKEN = githubToken;
                console.log("Exported GitHub token as GITHUB_TOKEN");
            }
            else {
                console.log("No matching rows found.");
            }
        });
    };
    //This will add a new github token value into the 'github_token' table
    Helper.prototype.addNewGitHubToken = function (token) {
        this.dbConnection.query("INSERT INTO github_token (value) VALUES (?)", [token], function (err, results) {
            if (err) {
                console.error("Error inserting GitHub token:", err);
            }
            else {
                console.log("GitHub token inserted into the 'github_token' table.");
            }
        });
    };
    Helper.prototype.close_db_connection = function () {
        // Close the database connection
        this.dbConnection.end();
    };
    return Helper;
}());
exports.Helper = Helper;
/*     EXAMPLE USAGE
const tokenManager = new Helper();
const newGitHubToken = "testing_github_token";
tokenManager.addNewGitHubToken(newGitHubToken);
tokenManager.close_db_connection();
*/ 
