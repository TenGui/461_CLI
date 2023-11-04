const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const { db } = require("./database_files/database_connect");
const app = express();

import { Helper } from "./database_files/authorization";
import rate_endpoint from "./app_endpoints/rate_endpoint";
app.use('/', rate_endpoint);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.post('/addUser', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err) => {
    if (err) throw err;

    res.send('User added successfully');
  });
});

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
    const helper = new Helper();
    helper.setEnvVariables();
    
  console.log(`Server is running on port ${port}`);
});