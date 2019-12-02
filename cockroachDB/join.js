/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to perform a join with cockroachdb/serializer
//
var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

// Connect to CockroachDB through Sequelize.
gpiiCockroach.sequelize = new Sequelize('evaluate_cockroachdb', 'maxroach', '', {
                              // DB name,              user       password (none)
    dialect: 'postgres',
    port: 26257,
    logging: fluid.log
});

gpiiCockroach.options = {};
gpiiCockroach.options.joinQuery = '\
    SELECT "gpiiKeys"."gpiiKey", preferences AS prefs, "timestampExpires"\
    FROM "gpiiKeys", "prefsSafes", "gpiiAppInstallationAuthorizations"\
    WHERE "gpiiAppInstallationAuthorizations"."timestampExpires" > CURRENT_TIMESTAMP\
    AND "gpiiAppInstallationAuthorizations"."gpiiKey" = "gpiiKeys"."gpiiKey"\
    AND "gpiiKeys"."prefsSafeId" = "prefsSafes"."prefsSafeId"\
';

// Do the query
gpiiCockroach.doQuery = function (options) {
    options.results = gpiiCockroach.sequelize.query(
        options.joinQuery,
        { type: gpiiCockroach.sequelize.QueryTypes.SELECT }
    );
    return options.results; // a Promise
};

// Print the result
gpiiCockroach.printQueryResult = function (options) {
    var results = options.results.value();
    fluid.each(results, function (aResult) {
        console.log(JSON.stringify(aResult, null, 2));
    });
    return "Done!";
}

// Run the sequence
gpiiCockroach.postgresQuery = function () {
    var sequence = [
        gpiiCockroach.doQuery,
        gpiiCockroach.printQueryResult
    ];
    fluid.promise.sequence(sequence, gpiiCockroach.options).then(
        function (result) {
            console.log(result[result.length-1]);
            process.exit(0);
        },
        function (error) {
            console.error('error: ' + err.message);
            process.exit(1);
        }
    );
}();
