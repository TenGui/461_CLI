import * as mysql from "mysql2";
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: "admin",
    password: process.env.DB_PASSWORD,
    database: "testdb",
});

console.log(process.env.DB_HOST);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DATABASE);
console.log(process.env.DB_USER);
const promisePool = db.promise();
export { promisePool, db };



