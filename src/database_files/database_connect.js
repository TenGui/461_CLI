"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mysql = require("mysql2");
require('dotenv').config();
var db = mysql.createConnection({
    host: "publicdb.cvr1hbjvaden.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "project461",
    database: "testdb",
});
exports.db = db;
db.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("DB connected");
});
