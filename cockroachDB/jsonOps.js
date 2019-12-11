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

// Get "raw" preferences
gpiiCockroach.extractRawPreferences = function (options) {
    options.extractResults = gpiiCockroach.sequelize.query(
        options.extractQuery,
        { type: gpiiCockroach.sequelize.QueryTypes.SELECT }
    );
    return options.extractResults;
};

// Print "raw" preferences
gpiiCockroach.printPreferences = function (options) {
    var prefs = options.extractResults.value();
    debugger;
    console.log(">>> preferences:");
    console.log(JSON.stringify(prefs, null, 2));
    return ">>> Printed preferences.";
};

// "Main"
gpiiCockroach.jsonOPs = function () {
    gpiiCockroach.initConnection(true);    // show log messages
    gpiiCockroach.sequelize['import']("./tableModels/prefsSafesModel.js");
    
    var options = {};
    options.prefsSafesModel = gpiiCockroach.prefsSafesModel;
    options.extractQuery = "\
        SELECT json_extract_path(\"preferences\"->'flat'->'contexts'->'gpii-default'->'preferences')\
        FROM \"prefsSafes\"\
    ";
    var sequence = [
        gpiiCockroach.checkConnection,
        gpiiCockroach.extractRawPreferences,
        gpiiCockroach.printPreferences
    ];
    fluid.promise.sequence(sequence, options).then (
        gpiiCockroach.exitNoErrors,
        gpiiCockroach.exitError
    );
}();

/* From:  https://forum.cockroachlabs.com/t/updating-json-document-in-place/2488
create table t (j json);
insert into t values ('{"a":123,"b":456}');
update t set j = json_set(j, '{a}'::string[], '789') where true;
select * from t;

See also: https://github.com/cockroachdb/docs/issues/4961


gpiiCockroach.replaceQuery = "\
    UPDATE \"prefsSafes\" SET preferences = json_set(preferences, 'flat'->'name', 'Carla preferences')\
    WHERE \"prefsSafeId\" = \"prefsSafe-carla\"\
    ";
*/
