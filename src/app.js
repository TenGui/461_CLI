"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var fs = require('fs');
var app = express();
var port = 3000;
//Include all endpoints here
var rate_endpoint_1 = require("./app_endpoints/rate_endpoint");
app.use('/', rate_endpoint_1.default);
var database_1 = require("./app_endpoints/database");
app.use(database_1.default);
//Home Page
app.get('/', function (req, res) {
    // Read the HTML content from the HTML file
    var htmlContent = fs.readFileSync('src/html/index.html', 'utf8');
    res.send(htmlContent);
});
app.listen(port, function () {
    console.log("Demo app is up and listening to port: ".concat(port));
});
