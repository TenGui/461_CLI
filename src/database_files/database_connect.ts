import * as mysql from "mysql2";
require('dotenv').config();

const db = mysql.createConnection({
    host: "publicdb.cvr1hbjvaden.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: 'project461',
    database: "testdb",
});

const promisePool = db.promise();
export { promisePool, db };



