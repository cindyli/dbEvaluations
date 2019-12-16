/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to perform a JSON merges, and print the results
// Prerequisites:
// 1. Run DockerStartInsecureCluster.sh in the "scripts" folder
// 2. Run `node loadDataBase.js` script to load the database with records

var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

require("./utils.js");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

gpiiCockroach.printResult = function (result, msg) {
    var retVal = ">>> Printed " + msg + ".";
    console.log(">>> " + msg + ":");
    console.log(JSON.stringify(result, null, 2));
    console.log(retVal);
    return retVal;
};

// Shallow query for top-level "name" field
gpiiCockroach.shallowNameQuery = function (options) {
    options.shallowNameQueryResult = gpiiCockroach.sequelize.query(
        options.shallowQuery,
        { type: gpiiCockroach.sequelize.QueryTypes.SELECT }
    );
    return options.shallowNameQueryResult;
};

// Print results of shallow query.
gpiiCockroach.printShallowQueryResult = function (options) {
    var result = options.shallowNameQueryResult.value();
    // Getting the actual result from a json_extract_path() call is ugly.
    return gpiiCockroach.printResult(result[0]["json_extract_path"], "Name");
};

// Get "raw" preferences -- a deeper query
gpiiCockroach.extractRawPreferences = function (options) {
    options.extractResults = gpiiCockroach.sequelize.query(
        options.deepQuery,
        { type: gpiiCockroach.sequelize.QueryTypes.SELECT }
    );
    return options.extractResults;
};

// Print "raw" preferences
gpiiCockroach.printPreferences = function (options) {
    var prefs = options.extractResults.value();
    return gpiiCockroach.printResult(prefs, "preferences");
};

// Replace the name of Carla's raw preferences
gpiiCockroach.replaceName = function (options) {
    options.replaceNameResult = gpiiCockroach.sequelize.query(
        options.replaceNameQuery,
        { type: gpiiCockroach.sequelize.QueryTypes.UPDATE }
    );
    return options.replaceNameResult;
};

// Log result of attempt of replacing name of preferences
gpiiCockroach.replaceNameResult = function (options) {
    var replaceNameResult = options.replaceNameResult.value();
    console.log ("preferences.name field replaced successfully");
    return replaceNameResult;
};

// "Main"
gpiiCockroach.jsonOPs = function () {
    gpiiCockroach.initConnection(true);    // show log messages
    gpiiCockroach.sequelize['import']("./tableModels/prefsSafesModel.js");
    
    var options = {};
    options.prefsSafesModel = gpiiCockroach.prefsSafesModel;
    
    options.shallowQuery = "\
        SELECT json_extract_path(preferences->'flat'->'name')\
        FROM \"prefsSafes\" AS \"prefsSafes\"\
        WHERE \"prefsSafes\".\"prefsSafeId\" = 'prefsSafe-carla'\
    ";
    options.deepQuery = "\
        SELECT json_extract_path(preferences->'flat'->'contexts'->'gpii-default'->'preferences')\
        FROM \"prefsSafes\"\
        WHERE \"prefsSafes\".\"prefsSafeId\" = 'prefsSafe-carla'\
    ";
    options.replaceNameQuery = "\
        UPDATE \"prefsSafes\" AS \"prefsSafes\"\
        SET preferences = json_set(preferences, '{flat,name}'::string[], '{\"name\": \"Carla preferences\"}')\
        WHERE \"prefsSafes\".\"prefsSafeId\" = 'prefsSafe-carla'\
    ";
    var sequence = [
        gpiiCockroach.checkConnection,
        
        // Should fetch and print "Name: Carla"
        gpiiCockroach.shallowNameQuery,
        gpiiCockroach.printShallowQueryResult,

        // Should fetch and print all of the "raw" preferences
        gpiiCockroach.extractRawPreferences,
        gpiiCockroach.printPreferences,

        // Should replace the "preferences.flat.name" value for Carla only
        gpiiCockroach.replaceName,
        gpiiCockroach.replaceNameResult,

        // Check the name has been replaced; should print
        // "Name: Carla preferences".  Also, the gpii-default preferences should
        // be the same
        gpiiCockroach.shallowNameQuery,
        gpiiCockroach.printShallowQueryResult,
        gpiiCockroach.extractRawPreferences,
        gpiiCockroach.printPreferences,

        function () { return ">>> Done"; }
    ];
    fluid.promise.sequence(sequence, options).then(
        gpiiCockroach.exitNoErrors,
        gpiiCockroach.exitError
    );
}();
