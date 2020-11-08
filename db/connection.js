const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "employeetracker"
});
module.exports = connection;