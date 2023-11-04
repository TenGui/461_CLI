const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

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

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static HTML file for the login and user addition pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Handle user addition
app.post('/addUser', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err) => {
    if (err) throw err;

    res.send('User added successfully');
  });
});

// Handle login
app.post('/login', (req, res) => {
  const { loginUsername, loginPassword } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [loginUsername, loginPassword], (err, results) => {
    console.log(results.length);
    if (err) throw err;

    if (results.length === 1) {
      res.send('Login Successful');
    } else {
      res.send('Login Failed');
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
