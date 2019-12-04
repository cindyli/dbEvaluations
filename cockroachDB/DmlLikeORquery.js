/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to perform a DML-like OR operation, and prinet the result
// Prerequisites:
// 1. Run DockerStartInsecureCluster.sh in the "scripts" folder
// 2. Run this script to load the database with recrods
//   $ node loadDataBase.js

var fs = require("fs");
var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

require("./tableModels.js");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

// Connect to CockroachDB through Sequelize.
gpiiCockroach.sequelize = new Sequelize('evaluate_cockroachdb', 'maxroach', '', {
                                        // DB name,              user       password (none)
    dialect: 'postgres',
    port: 26257,
    logging: false
});

gpiiCockroach.sequelize['import']("./tableModels/gpiiKeysModel.js");

// DML-like OR query using the gpiiKeys table
gpiiCockroach.DmlLikeORquery = function (options) {
    options.DmlLikeORresult = options.gpiiKeysModel.findAll({
        where: {
            gpiiKey: {
                $or: [ "carla", "alice" ]
            }
        }}
    );
    // SELECT * FROM "gpiiKeys" WHERE "gpiiKey" = 'carla' OR "gpiiKey" = 'alice';
    return options.DmlLikeORresult;
};

// Print the result of the DML-like OR query
gpiiCockroach.printDmlLikeORquery = function (options) {
    var records = options.DmlLikeORresult.value();
    console.log(">>> Result of DML-like OR query - 'carla' and 'alice' GPII Keys:");
    console.log(JSON.stringify(records, null, 2));
    return ">>> Printed 'carla' and 'alice' GPII Keys";
};

// Run the query, and print the results
gpiiCockroach.queryAndLog = function () {
    var options = {};
    options.gpiiKeysModel = gpiiCockroach.gpiiKeysModel;
    fluid.promise.sequence(
        [
            gpiiCockroach.DmlLikeORquery,
            gpiiCockroach.printDmlLikeORquery
        ], options
    ).then(
        function (result) {
            console.log(result[result.length-1]);
            process.exit(0);
        }, 
        function (err) {
            console.error('error: ' + err.message);
            process.exit(1);
        }
    );
}();
        