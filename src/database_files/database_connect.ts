import * as mysql from "mysql2";
require('dotenv').config();

const db = mysql.createConnection({
    host: "10.0.0.57",
    port: 3306,
    user: "root",
    password: "AbCd1234",
    database: "testdb",
});

const promisePool = db.promise();
export { promisePool, db };



