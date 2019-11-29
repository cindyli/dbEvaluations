/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to load a cockroachDB with GPII keys, prefsSafes, and credentials
// Prerequisites:
// 1. Run DockerStartInsecureCluster.sh in the "scripts" folder
// 2. Run this script:
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
gpiiCockroach.sequelize['import']("./tableModels/prefsSafesModel.js");
gpiiCockroach.sequelize['import']("./tableModels/gpiiAppInstallationAuthorization.js");

// Function to create the tables
gpiiCockroach.createTables = function (options) {
    return fluid.promise.sequence([
        options.gpiiKeysModel.sync({force: true}),
        options.prefsSafesModel.sync({force: true}),
        options.appInstallationAuthorizationsModel.sync({force: true})
    ]);
};

// Function to insert keys into the GPII keys table
gpiiCockroach.insertGpiiKeys = function (options) {
    return options.gpiiKeysModel.bulkCreate(
        [
            { gpiiKey: "alice", schemaVersion: "0.2", prefsSafeId: "prefsSafe-alice", revoked: false, revokedReason: null, timestampCreated: new Date().toISOString() },
            { gpiiKey: "carla", schemaVersion: "0.2", prefsSafeId: "prefsSafe-carla", revoked: false, revokedReason: null, timestampCreated: new Date().toISOString() },
            { gpiiKey: "user1", schemaVersion: "0.2", prefsSafeId: "prefsSafe-user1", revoked: false, revokedReason: null, timestampCreated: new Date().toISOString() }
        ]
    );
};

// Load the prefsSafes table
gpiiCockroach.insertPrefSafes = function (options) {
    return options.prefsSafesModel.bulkCreate(
        [
            { prefsSafeId: "prefsSafe-carla", schemaVersion: "0.2", prefsSafeType: "snapset", name: "carla preferences", preferences: JSON.parse(fs.readFileSync("./data/carla.json")), timestampCreated: new Date().toISOString() },
            { prefsSafeId: "prefsSafe-alice", schemaVersion: "0.2", prefsSafeType: "snapset", name: "alice preferences", preferences: JSON.parse(fs.readFileSync("./data/alice.json")), timestampCreated: new Date().toISOString() },
            { prefsSafeId: "prefsSafe-user1", schemaVersion: "0.2", prefsSafeType: "snapset", name: "user1 preferences", preferences: JSON.parse(fs.readFileSync("./data/user1.json")), timestampCreated: new Date().toISOString() }
        ]
    );
};

// Load the gpiiAppInstallationAuthorizations table
gpiiCockroach.insertAppInstallationAuthorizations = function (options) {
    return options.appInstallationAuthorizationsModel.bulkCreate(
        [
            { accessToken: "expired", schemaVersion: "0.2", clientId: "gpiiAppInstallationClient-1", gpiiKey: "carla", revoked: false, revokedReason: null, timestampExpires: new Date().toISOString() },
            { accessToken: "unexpired", schemaVersion: "0.2", clientId: "gpiiAppInstallationClient-1", gpiiKey: "alice", revoked: false, revokedReason: null, timestampExpires: new Date().toISOString() }
        ]
    );
};

// Function to retrieve all gpiiKeys
gpiiCockroach.retrieveGpiiKeys = function (options) {
    // Retrieve the keys
    options.gpiiKeys = options.gpiiKeysModel.findAll();
    return options.gpiiKeys;    // a Promise
};

// Function to print out gpiiKeys
gpiiCockroach.printGpiiKeys = function (options) {
    // Print out the contents of the keys
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

// Overall function
gpiiCockroach.doItAll = function () {
    var options = {};
    options.id = "Here be options";
    options.gpiiKeysModel = gpiiCockroach.gpiiKeysModel;
    options.prefsSafesModel = gpiiCockroach.prefsSafesModel;
    options.appInstallationAuthorizationsModel = gpiiCockroach.appInstallationAuthorizationsModel;
    var sequence = [
        gpiiCockroach.createTables,
        gpiiCockroach.insertGpiiKeys,
        gpiiCockroach.insertPrefSafes,
        gpiiCockroach.insertAppInstallationAuthorizations,
        gpiiCockroach.retrieveGpiiKeys,
        gpiiCockroach.printGpiiKeys
    ];
    fluid.promise.sequence(sequence, options).then(
        gpiiCockroach.exitNoErrors,
        gpiiCockroach.exitError
    );
}();
