// Imports the Google Cloud client library
var {Spanner} = require('@google-cloud/spanner');
var fs = require("fs");

var projectId = "evaluate-cloud-spanner";
var instanceId = "evaluate-spanner-instance";
var databaseId = "gpii";

// Creates a client
var spanner = new Spanner({
  projectId: projectId,
});

// Gets a reference to a Cloud Spanner instance
var instance = spanner.instance(instanceId);
var database = instance.database(databaseId);
var timestampNow = new Date().toJSON();

async function queryWithJoin(table, data) {
    var query = {
        sql: `SELECT gpiiKeys.gpiiKey, JSON_QUERY(prefsSafes.preferences, "$") as prefs
            FROM gpiiKeys, prefsSafes
            WHERE (gpiiKeys.gpiiKey = "carla"
            OR gpiiKeys.gpiiKey = "user1")
            AND gpiiKeys.prefsSafeId = prefsSafes.prefsSafeId`,
    };

    try {
        var [rows] = await database.run(query);

        rows.forEach(row => {
            var json = row.toJSON();
            var prefs = JSON.parse(json.prefs);
            // prefs = JSON.stringify(prefs["flat"]);
            console.log("gpiiKey: ", json.gpiiKey);
            console.log("prefs: ", json.prefs);
        });
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        // Close the database when finished
        database.close();
    }
}

queryWithJoin();
