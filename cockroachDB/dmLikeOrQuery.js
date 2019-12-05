/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to perform a DML-like OR operation, and print the result
// Prerequisites:
// 1. Run DockerStartInsecureCluster.sh in the "scripts" folder
// 2. Run `node loadDataBase.js` script to load the database with records

var fs = require("fs");
var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

require("./utils.js");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

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
gpiiCockroach.printDmlLikeORresult = function (options) {
    var records = options.DmlLikeORresult.value();
    console.log(">>> Result of DML-like OR query - 'carla' and 'alice' GPII Keys:");
    console.log(JSON.stringify(records, null, 2));
    return ">>> Printed 'carla' and 'alice' GPII Keys";
};

// Run the query, and print the results
gpiiCockroach.queryAndLog = function () {
    gpiiCockroach.initConnection(true);    // show log messages
    gpiiCockroach.sequelize['import']("./tableModels/gpiiKeysModel.js");

    var options = {};
    options.gpiiKeysModel = gpiiCockroach.gpiiKeysModel;
    fluid.promise.sequence(
        [
            gpiiCockroach.DmlLikeORquery,
            gpiiCockroach.printDmlLikeORresult
        ],
        options
    ).then(
        gpiiCockroach.exitNoErrors,
        gpiiCockroach.exitError
    );
}();
        