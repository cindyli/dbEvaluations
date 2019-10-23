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

const gpiiKeysData = [
    {
        gpiiKey: "carla",
        schemaVersion: "0.2",
        prefsSafeId: "prefsSafe-carla",
        revoked: false,
        revokedReason: null,
        timestampCreated: new Date().toJSON()
    },
    {
        gpiiKey: "alice",
        schemaVersion: "0.2",
        prefsSafeId: "prefsSafe-alice",
        revoked: false,
        revokedReason: null,
        timestampCreated: new Date().toJSON()
    },
    {
        gpiiKey: "user1",
        schemaVersion: "0.2",
        prefsSafeId: "prefsSafe-user1",
        revoked: false,
        revokedReason: null,
        timestampCreated: new Date().toJSON()
    },
];

var prefsSafesData = [
    {
        prefsSafeId: "prefsSafe-carla",
        schemaVersion: "0.2",
        prefsSafeType: "snapset",
        name: "carla preferences",
        preferences: JSON.stringify(JSON.parse(fs.readFileSync("./data/carla.json"))),
        timestampCreated: new Date().toJSON()
    },
    {
        prefsSafeId: "prefsSafe-alice",
        schemaVersion: "0.2",
        prefsSafeType: "snapset",
        name: "alice preferences",
        preferences: JSON.stringify(JSON.parse(fs.readFileSync("./data/alice.json"))),
        timestampCreated: new Date().toJSON()
    },
    {
        prefsSafeId: "prefsSafe-user1",
        schemaVersion: "0.2",
        prefsSafeType: "user",
        name: "user1 preferences",
        preferences: JSON.stringify(JSON.parse(fs.readFileSync("./data/user1.json"))),
        timestampCreated: new Date().toJSON()
    },
];

var accessTokensData = [
    {
        accessToken: "expired",
        "schemaVersion": "0.2",
        clientId: "gpiiAppInstallationClient-1",
        gpiiKey: "carla",
        revoked: false,
        revokedReason: null,
        timestampRevoked: "2019-10-17T14:10:14.096Z"
    },
    {
        accessToken: "unexpired",
        "schemaVersion": "0.2",
        clientId: "gpiiAppInstallationClient-1",
        gpiiKey: "alice",
        revoked: false,
        revokedReason: null,
        timestampRevoked: "2021-10-17T14:10:14.096Z"
    }
];

async function insert(table, data) {
    var table = database.table(table);
    try {
        await table.insert(data);
        console.log('Inserted data.');
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        // Close the database when finished
        database.close();
    }
}

// insert("gpiiKeys", gpiiKeysData);
insert("prefsSafes", prefsSafesData);
// insert("gpiiAppInstallationAuthorizations", accessTokensData);
