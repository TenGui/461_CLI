import * as mysql from "mysql2";
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: "admin",
    password: process.env.DB_PASSWORD,
    database: "testdb",
});

const promisePool = db.promise();
export { promisePool, db };



