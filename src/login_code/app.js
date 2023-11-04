var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
// Replace these values with your RDS instance information
var RDS_HOST = 'publicdb.cvr1hbjvaden.us-east-2.rds.amazonaws.com';
var RDS_PORT = 3306; // Default MySQL port
var RDS_USER = 'admin';
var RDS_PASSWORD = 'project461';
// Create a connection to the MySQL server
var db = mysql.createConnection({
    host: RDS_HOST,
    user: RDS_USER,
    password: RDS_PASSWORD,
    port: RDS_PORT,
    database: 'user_database'
});
db.connect(function (err) {
    if (err)
        throw err;
    console.log('Connected to MySQL');
});
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static HTML file for the login and user addition pages
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
// Handle user addition
app.post('/addUser', function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    var query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], function (err) {
        if (err)
            throw err;
        res.send('User added successfully');
    });
});
// Handle login
app.post('/login', function (req, res) {
    var _a = req.body, loginUsername = _a.loginUsername, loginPassword = _a.loginPassword;
    var query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [loginUsername, loginPassword], function (err, results) {
        console.log(results.length);
        if (err)
            throw err;
        if (results.length === 1) {
            res.send('Login Successful');
        }
        else {
            res.send('Login Failed');
        }
    });
});
// Start the server
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
