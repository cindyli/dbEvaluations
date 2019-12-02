/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to perform a join with cockroachdb/serializer
var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

require("./tableModels.js");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

// Connect to CockroachDB through Sequelize.
gpiiCockroach.sequelize = new Sequelize('evaluate_cockroachdb', 'maxroach', '', {
                              // DB name,              user       password (none)
    dialect: 'postgres',
    port: 26257,
    logging: fluid.log
});

gpiiCockroach.joinQuery = '\
    SELECT "gpiiKeys"."gpiiKey", preferences AS prefs, "timestampExpires"\
    FROM "gpiiKeys", "prefsSafes", "gpiiAppInstallationAuthorizations"\
    WHERE "gpiiAppInstallationAuthorizations"."timestampExpires" > CURRENT_TIMESTAMP\
    AND "gpiiAppInstallationAuthorizations"."gpiiKey" = "gpiiKeys"."gpiiKey"\
    AND "gpiiKeys"."prefsSafeId" = "prefsSafes"."prefsSafeId"\
';
//SELECT "gpiiKey" FROM "gpiiKeys", "preferences" AS prefs, timestampExpires FROM "gpiiKeys", "prefsSafes", "gpiiAppInstallationAuthorizations"\

gpiiCockroach.sequelize.query(
//    'SELECT "gpiiKey", "preferences" AS prefs FROM "gpiiKeys", "prefsSafes"',
    gpiiCockroach.joinQuery,
    { type: gpiiCockroach.sequelize.QueryTypes.SELECT }
)
.then(function (results) {
    debugger;
    console.log(results);
})
.then(function () {
    process.exit(0);
});

