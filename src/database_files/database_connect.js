"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mysql = require("mysql2");
require('dotenv').config();
var db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
exports.db = db;
db.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("DB connected");
});
