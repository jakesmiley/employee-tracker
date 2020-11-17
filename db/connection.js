const mysql = require("mysql");
const connectionProperties = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Aislin15awesome!",
  database: "employeetracker"
});

module.exports = connection;