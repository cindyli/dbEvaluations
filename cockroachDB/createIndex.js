/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Test script to check adding an index into the prefsSafes table
// 1. Run DockerStartInsecureCluster.sh in the "scripts" folder
// 2. Run `node loadDataBase.js` script to load the database with records
// 3. Run this script
//
// Note that this will fail because:
// * cockroachDB does not support creating indeces to JSON columns, but
// * Sequelize will transform the JSON-based index into a "CREATE" statement
//
// The output from this script is as follows, and shows that, first the current
// table in the database is removed and replaced with the new table definition
// that includes the index.  The contents of the old table are lost at this
// point, as is expected.  When the attempt to recreate the table with an index
// is done, it fails with an "unimplemented" message.
//
// The full result is:
// Executing (default): DROP TABLE IF EXISTS "prefsSafes" CASCADE;
// Executing (default): CREATE TABLE IF NOT EXISTS "prefsSafes" ("prefsSafeId" VARCHAR(36) , "schemaVersion" VARCHAR(100), "prefsSafeType" VARCHAR(100), "name" VARCHAR(255), "preferences" JSON, "timestampCreated" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("prefsSafeId"));
// Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'prefsSafes' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
// Executing (default): CREATE INDEX "preferences_index" ON "prefsSafes" ("preferences")
// error: unimplemented: column preferences is of type jsonb and thus is not indexable
//
// See: https://github.com/cockroachdb/cockroach/issues/35730 (HINT: You have attempted to use a feature that is not yet implemented.)

var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

require("./utils.js");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");
gpiiCockroach.initConnection(true);

// Create the prefsSafes model with an index -- don't import
// "./tables/prefsSafesModel.js"
gpiiCockroach.prefsSafesModel = gpiiCockroach.sequelize.define('prefsSafes', {
  prefsSafeId: { type: Sequelize.STRING(36), primaryKey: true },
  schemaVersion: { type: Sequelize.STRING(100) },
  prefsSafeType: { type: Sequelize.STRING(100) },
  name: { type: Sequelize.STRING(255) },
  preferences: { type: Sequelize.JSON },
  timestampCreated: { type: Sequelize.DATE }
}, {
  indexes: [
    {
      name: "preferences_index",
      fields: [ "preferences" ],
    }
  ]
  // CREATE INDEX "preferences_index" ON "prefsSafes" ("preferences")
});

gpiiCockroach.prefsSafesModel.sync({force: true})
.then(
    function (result) {  // not reached
        var retVal = result.value();
        console.log(retVal);
        process.exit(0);
    },
    function (error) {
        console.error('error: ' + error.message);
        process.exit(1);
    }
);
