/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Shared functions for the CockroachDB/Sequelize evaluation scripts.
// Prerequisite: an 'evaluate_cockroachdb' database:
//   - Run DockerStartInsecureCluster.sh in the "scripts" folder

var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

// Connect to CockroachDB through Sequelize.
gpiiCockroach.initConnection = function (loggingMethod) {
    gpiiCockroach.sequelize = new Sequelize('evaluate_cockroachdb', 'maxroach', '', {
                                            // DB name,              user       password (none)
        dialect: 'postgres',
        port: 26257,
        logging: loggingMethod
    });
};

// Check connection
gpiiCockroach.checkConnection = function () {
    return gpiiCockroach.sequelize.validate();  // a Promise
}

// Function to exit cleanly
gpiiCockroach.exitNoErrors = function (result) {
    console.log(result[result.length-1]);
    process.exit(0);
};

// Function to exit with an error
gpiiCockroach.exitError = function (err) {
    console.error('error: ' + err.message);
    process.exit(1);
};
