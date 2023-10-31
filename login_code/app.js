const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const router = express.Router(); // Create an Express router

// Replace these values with your RDS instance information
const RDS_HOST = 'publicdb.cvr1hbjvaden.us-east-2.rds.amazonaws.com';
const RDS_PORT = 3306; // Default MySQL port
const RDS_USER = 'admin';
const RDS_PASSWORD = 'project461';

// Create a connection to the MySQL server
const db = mysql.createConnection({
  host: RDS_HOST,
  user: RDS_USER,
  password: RDS_PASSWORD,
  port: RDS_PORT,
  database: 'user_database'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Define the login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    console.log(results.length);
    if (err) throw err;

    if (results.length === 1) {
      res.send('Login Successful');
    } else {
      res.send('Login Failed');
    }
  });
});

module.exports = router; // Export the router
