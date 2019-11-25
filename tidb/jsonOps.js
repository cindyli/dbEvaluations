// TiDB supports:
// 1. query values from nested paths;
// 2. deep update at specified paths.

var mysql = require("mysql");
var async = require('async');

require("./utils.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 4000,
  user: "root",
  password: "",
  database: "evaluate_tidb"
});

// Support the retrieval of values at specific nested paths.
var statement_extract = `SELECT JSON_EXTRACT(preferences, '$.flat.contexts."gpii-default".preferences') FROM prefsSafes`;
// Support the replacement of values at specified nested paths.
var statement_replace = `UPDATE prefsSafes SET preferences = JSON_REPLACE(preferences, '$.flat.contexts."gpii-default".name', "Carla's preferences") WHERE prefsSafeId="prefsSafe-carla"`;
var statement_query_after_replace = `SELECT preferences FROM prefsSafes WHERE prefsSafeId="prefsSafe-carla"`;

async.series([
    function(callback){
        connection.connect(function(err) {
            callback();
        });
    },

    function(callback){
        console.log("1. Extract the value from a nested path: \n");
        connection.query(statement_extract, function(err, result) {
            console.log("result: ", result);
            callback();
        });
    },

    function(callback) {
        console.log("\n2. Insert or replace values at specified paths: \n");
        connection.query(statement_replace, function(err, result) {
            console.log("result: ", result);
            callback();
        });
    },

    function(callback) {
        console.log("\n3. Query replaced value: \n");
        connection.query(statement_query_after_replace, function(err, result) {
            console.log("result: ", result);
            connection.end(); //closes connection at the last query
            callback();
        });
    }
]);
