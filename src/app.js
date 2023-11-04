"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var db = require("./database_files/database_connect").db;
var app = express();
var authorization_1 = require("./database_files/authorization");
var rate_endpoint_1 = require("./app_endpoints/rate_endpoint");
app.use('/', rate_endpoint_1.default);
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
app.post('/addUser', function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    var query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], function (err) {
        if (err)
            throw err;
        res.send('User added successfully');
    });
});
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
    var helper = new authorization_1.Helper();
    helper.setEnvVariables();
    console.log("Server is running on port ".concat(port));
});
