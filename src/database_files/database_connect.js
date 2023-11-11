"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.promisePool = void 0;
var mysql = require("mysql2");
require('dotenv').config();
var db = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5, // Adjust as needed
});
exports.db = db;
var promisePool = db.promise();
exports.promisePool = promisePool;
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
// });
// db.connect((err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log("DB connected");
// });
