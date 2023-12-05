import * as mysql from "mysql2";
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const promisePool = db.promise();
export { promisePool, db };



