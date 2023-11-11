const express = require('express');
const app = express();
const { db } = require("../database_files/database_connect");

app.post('/reset', (req, res) => {
  // Check the X-Authorization header for authentication if needed
  
  //TODO: Check authorization key to determine if request is valid
  resetDatabase(res);
});

export async function resetDatabase(res) {
  const getTableNamesQuery = 'SHOW TABLES';
  db.query(getTableNamesQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving table names:', err);
      res.status(500).send('Error resetting the database');
    } else {
      const tableNames = results.map(row => Object.values(row)[0]);
      const tablesToTruncate = tableNames.filter(tableName => tableName !== 'github_token');

      if (tablesToTruncate.length === 0) {
        console.log('No tables to reset.');
        res.sendStatus(200);
        return;
      }

      let completedCount = 0;
      tablesToTruncate.forEach(tableName => {
        const truncateTableQuery = `TRUNCATE TABLE ${tableName}`;
        db.query(truncateTableQuery, (err) => {
          completedCount++;
          if (err) {
            console.error(`Error truncating table ${tableName}:`, err);
          } else {
            console.log(`Table ${tableName} truncated successfully`);
          }

          if (completedCount === tablesToTruncate.length) {
            console.log('All tables except for "github_token" truncated successfully');
            res.sendStatus(200);
          }
        });
      });
    }
  });
}

export default app;
