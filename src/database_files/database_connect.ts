import * as mysql from "mysql2";
require('dotenv').config();

const db = mysql.createPool({
    host: "publicdb.cvr1hbjvaden.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "project461",
    database: "testdb",
    connectionLimit: 5, // Adjust as needed
});
const promisePool = db.promise();
export { promisePool, db };

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



