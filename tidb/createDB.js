var mysql = require("mysql");

require("./utils.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 4000,
  user: "root",
  password: ""
});

var createStatement = "CREATE DATABASE evaluate_tidb";

handleQuery(connection, createStatement);
