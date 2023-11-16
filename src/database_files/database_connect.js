"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.promisePool = void 0;
var mysql = require("mysql2");
require('dotenv').config();
var db = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: "admin",
    password: process.env.DB_PASSWORD,
    database: "testdb",
});
exports.db = db;
var promisePool = db.promise();
exports.promisePool = promisePool;
