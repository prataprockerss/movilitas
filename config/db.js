let mysql = require("mysql");
let constants = require("./constants");
let util = require("util");

// create connection

let { DB_CONFIG } = constants;

let connection = mysql.createConnection({
    host: DB_CONFIG.HOST,
    user: DB_CONFIG.USERNAME,
    password: DB_CONFIG.PASSWORD,
    database: DB_CONFIG.DB,
});

connection.query = util.promisify(connection.query);

module.exports = connection;
