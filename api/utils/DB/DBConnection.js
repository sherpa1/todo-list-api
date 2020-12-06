const mysql = require('mysql');

const DB_HOST = process.env['DB_HOST'];
const DB_NAME = process.env['DB_NAME'];
const DB_USER = process.env['DB_USER'];
const DB_PWD = process.env['DB_PWD'];


const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD,
    database: DB_NAME
});

db.connect(function (err) {

    if (err) throw err;

    console.log(`Successful connection to DB "${DB_NAME}"`);

});


module.exports = db;