import * as mysql from "mysql2";
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("DB connected");

});
export { db }



