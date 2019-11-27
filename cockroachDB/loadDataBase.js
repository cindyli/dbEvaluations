/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to load a cockroachDB with GPII keys, prefsSafes, and credentials
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

var fs = require("fs");
var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

// Connect to CockroachDB through Sequelize.
gpiiCockroach.sequelize = new Sequelize('evaluate_cockroachdb', 'maxroach', '', {
                              // DB name,              user       password (none)
    dialect: 'postgres',
    port: 26257,
    logging: false
});

// Define the GPII key model for the GPII key table.
gpiiCockroach.gpiiKeyModel = gpiiCockroach.sequelize.define('gpiiKeys', {
  id: { type: Sequelize.STRING(36), primaryKey: true },
  schemaVersion: { type: Sequelize.STRING(100) },
  prefsSafeId: {type: Sequelize.STRING(36) },
  revoked: { type: Sequelize.BOOLEAN },
  revokedReason: { type: Sequelize.STRING },
  timestampCreated: { type: Sequelize.DATE }
});

// Likewise, define the prefsSafes model.
gpiiCockroach.prefsSafesModel = gpiiCockroach.sequelize.define('prefsSafes', {
  prefsSafeId: { type: Sequelize.STRING(36), primaryKey: true },
  schemaVersion: { type: Sequelize.STRING(100) },
  prefsSafeType: {type: Sequelize.STRING(100) },
  name: { type: Sequelize.STRING(255) },
  preferences: { type: Sequelize.JSON },
  timestampCreated: { type: Sequelize.DATE }
});

// And, the credentials model.
gpiiCockroach.appInstallationAuthorizationsModel = gpiiCockroach.sequelize.define('gpiiAppInstallationAuthorizations', {
  accessToken: { type: Sequelize.STRING(36), primaryKey: true },
  schemaVersion: { type: Sequelize.STRING(100) },
  clientId: {type: Sequelize.STRING(36) },
  gpiiKey: {type: Sequelize.STRING(36) },
  revoked: { type: Sequelize.BOOLEAN },
  revokedReason: { type: Sequelize.STRING },
  timestampExpires: { type: Sequelize.DATE }
});

// Function to create the tables
gpiiCockroach.createTables = function (options) {
    return fluid.promise.sequence([
        options.gpiiKeyModel.sync({force: true}),
        options.prefsSafesModel.sync({force: true}),
        options.appInstallationAuthorizationsModel.sync({force: true})
    ]);
};

// Function to insert keys into the GPII keys table
gpiiCockroach.insertGpiiKeys = function (options) {
    return options.gpiiKeyModel.bulkCreate(
        [
            { id: "carla", schemaVersion: "0.2", prefsSafeId: "prefsSafe-carla", revoked: false, revokedReason: null, timestampCreated: new Date().toISOString() },
            { id: "alice", schemaVersion: "0.2", prefsSafeId: "prefsSafe-alice", revoked: false, revokedReason: null, timestampCreated: new Date().toISOString() },
            { id: "user1", schemaVersion: "0.2", prefsSafeId: "prefsSafe-user1", revoked: false, revokedReason: null, timestampCreated: new Date().toISOString() }
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
    options.gpiiKeys = options.gpiiKeyModel.findAll();
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
    options.gpiiKeyModel = gpiiCockroach.gpiiKeyModel;
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
