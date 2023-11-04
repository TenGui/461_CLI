const express = require('express');
const app = express();
const { db } = require("../database_files/database_connect");

app.post('/reset', (req, res) => {
    // Check the X-Authorization header for authentication if needed
    resetDatabase();
    
    res.status(303).set('Location', '/');
    res.end();
});

function resetDatabase() {
    const getTableNamesQuery = 'SHOW TABLES';
    db.query(getTableNamesQuery, (err, results) => {
      if (err) {
        console.error('Error retrieving table names:', err);
      } else {
        const tableNames = results.map(row => Object.values(row)[0]);
        const tablesToTruncate = tableNames.filter(tableName => tableName !== 'github_token');
  
        tablesToTruncate.forEach(tableName => {
          const truncateTableQuery = `TRUNCATE TABLE ${tableName}`;
          db.query(truncateTableQuery, (err) => {
            if (err) {
              console.error(`Error truncating table ${tableName}:`, err);
            } else {
              console.log(`Table ${tableName} truncated successfully`);
            }
          });
        });
  
        console.log('All tables except for "github_token" truncated successfully');
      }
    });
  }

export default app;