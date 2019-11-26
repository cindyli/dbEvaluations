/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to load a cockroachDB with GPII keys and preferences
// Prerequisites:
// 1. Run StartInsecureLocalCluster.sh in the "scripts" folder
// 2. Allocate the database and user using cockroachDB's sql command line interface:
//   $ cockroach sql --insecure
//   $ CREATE USER IF NOT EXISTS maxroach
//   $ CREATE DATABASE evaluate_cockroachdb
//   $ GRANT ALL ON DATABASE evaluate_cockroachdb TO maxroach
//   $ \q
// 3. Run this script:
//   $ node loadDataBase.js

var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

debugger;
// Connect to CockroachDB through Sequelize.
var sequelize = new Sequelize('evaluate_cockroachdb', 'maxroach', '', {
                              // DB name,              user       password (none)
    dialect: 'postgres',
    port: 26257,
    logging: false
});

// Define the GPII key model for the GPII key table.
gpiiCockroach.gpiiKeyModel = sequelize.define('gpiiKeys', {
  id: { type: Sequelize.STRING(36), primaryKey: true },
  schemaVersion: { type: Sequelize.STRING(100) },
  prefsSafeId: {type: Sequelize.STRING(36) },
  revoked: { type: Sequelize.INTEGER }, // TINYINT not supported
  revokedReason: { type: Sequelize.STRING },
  timestampCreated: { type: Sequelize.DATE }
});

// Function to create the GPII keys table
gpiiCockroach.createGpiiKeys = function (options) {
    return options.gpiiKeyModel.sync({force: true});
};

// Function to insert keys into the GPII keys table
gpiiCockroach.insertGpiiKeys = function (options) {
    return options.gpiiKeyModel.bulkCreate(
        [
            {id: "carla", schemaVersion: "0.2", prefsSafeId: "prefsSafe-carla", revoked: "0", revokedReason: null, timestampCreated: new Date().toISOString() },
            {id: "alice", schemaVersion: "0.2", prefsSafeId: "prefsSafe-alice", revoked: "0", revokedReason: null, timestampCreated: new Date().toISOString() },
            {id: "user1", schemaVersion: "0.2", prefsSafeId: "prefsSafe-user1", revoked: "0", revokedReason: null, timestampCreated: new Date().toISOString() },
        ]
    );
};

// Function to retrieve all gpiiKeys
gpiiCockroach.retrieveGpiiKeys = function (options) {
    // Retrieve Accounts
    options.gpiiKeys = options.gpiiKeyModel.findAll();
    return options.gpiiKeys;    // a Promise
};

// Function to print out gpiiKeys
gpiiCockroach.printGpiiKeys = function (options) {
    // Print out the balances
    var keys = options.gpiiKeys.value();
    keys.forEach(function(key) {
        console.log(JSON.stringify(key, null, 2));
    });
    return "Done!";
};

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

debugger;
// Overall function
gpiiCockroach.doItAll = function () {
    var options = {};
    options.id = "Here be options";
    options.gpiiKeyModel = gpiiCockroach.gpiiKeyModel;
    var sequence = [
        gpiiCockroach.createGpiiKeys,
        gpiiCockroach.insertGpiiKeys,
        gpiiCockroach.retrieveGpiiKeys,
        gpiiCockroach.printGpiiKeys
    ];
    fluid.promise.sequence(sequence, options).then(
        gpiiCockroach.exitNoErrors,
        gpiiCockroach.exitError
    );
}();
