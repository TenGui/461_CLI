"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.promisePool = void 0;
var mysql = require("mysql2");
require('dotenv').config();
var db = mysql.createConnection({
    host: "10.0.0.57",
    port: 3306,
    user: "root",
    password: "AbCd1234",
    database: "testdb",
});
exports.db = db;
var promisePool = db.promise();
exports.promisePool = promisePool;
