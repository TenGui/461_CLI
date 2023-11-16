"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.promisePool = void 0;
var mysql = require("mysql2");
require('dotenv').config();
var db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: "admin",
    password: process.env.DB_PASSWORD,
    database: "testdb",
});
exports.db = db;
console.log(process.env.DB_HOST);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DATABASE);
console.log(process.env.DB_USER);
var promisePool = db.promise();
exports.promisePool = promisePool;
