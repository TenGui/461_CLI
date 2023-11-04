import * as mysql from "mysql2";
import { db } from "./database_connect";
const axios = require('axios');

class Helper{
  private dbConnection: mysql.Connection;

  constructor() {
    this.dbConnection = db;
  }

  setEnvVariables() {
    const query = `SELECT value FROM github_token WHERE id = 1`;

    this.dbConnection.query(query, [1], (err, results) => {
      if (err) {
        console.error("Error retrieving value from 'github_token':", err);
        return;
      }
      const rows = results as mysql.RowDataPacket[];

      if (rows.length === 1) {
        const githubToken = rows[0].value;
        console.log(`Retrieved GitHub token value}`);
        process.env.GITHUB_TOKEN = githubToken;
        console.log(`Exported GitHub token as GITHUB_TOKEN`);
      } else {
        console.log("No matching rows found.");
      }
    });
  }

  //This will add a new github token value into the 'github_token' table
  addNewGitHubToken(token: string): void {
    this.dbConnection.query(
      `INSERT INTO github_token (value) VALUES (?)`,
      [token],
      (err, results) => {
        if (err) {
          console.error(`Error inserting GitHub token:`, err);
        } else {
          console.log(`GitHub token inserted into the 'github_token' table.`);
        }
      }
    );
  }

  close_db_connection(){
    // Close the database connection
    this.dbConnection.end();
  }
}

export {Helper}
/*     EXAMPLE USAGE
const tokenManager = new Helper();
const newGitHubToken = "testing_github_token";
tokenManager.addNewGitHubToken(newGitHubToken);
tokenManager.close_db_connection();
*/