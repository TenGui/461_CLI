const express = require('express');
const app = express();
const { db } = require("../database_files/database_connect");

export async function resetDatabase(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const getTableNamesQuery = 'SHOW TABLES';
    db.query(getTableNamesQuery, (err, results) => {
      if (err) {
        console.error('Error retrieving table names:', err);
        reject(-1);
      } else {
        const tableNames = results.map(row => Object.values(row)[0]);
        const tablesToTruncate = tableNames.filter(tableName => tableName !== 'github_token');

        if (tablesToTruncate.length === 0) {
          console.log('No tables to reset.');
          resolve(1);
        }

        let completedCount = 0;
        tablesToTruncate.forEach(tableName => {
          const truncateTableQuery = `DELETE FROM ${tableName}`;
          db.query(truncateTableQuery, (err) => {
            completedCount++;
            if (err) {
              console.error(`Error DELETING table ${tableName}:`, err);
              reject(-1);
            } else {
              console.log(`Table ${tableName} deleted successfully`);
            }

            if (completedCount === tablesToTruncate.length) {
              console.log('All tables except for "github_token" deleted successfully');
              let queryString: string = 'INSERT INTO Auth VALUES (?,?,?,?,?,?)';
              db.execute(queryString, ["ece30861defaultadminuser", "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;", 1, 1, 1, 1]);
              resolve(1);
            }
          });
        });
      }
    });
  });
}

export default app;
