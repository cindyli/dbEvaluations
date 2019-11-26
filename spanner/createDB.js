// Imports the Google Cloud client library
var {Spanner} = require('@google-cloud/spanner');

var projectId = "evaluate-cloud-spanner";
var instanceId = "evaluate-spanner-instance";
var databaseId = "gpii";

// Creates a client
const spanner = new Spanner({
  projectId: projectId,
});

// Gets a reference to a Cloud Spanner instance
const instance = spanner.instance(instanceId);

// Note: Cloud Spanner interprets Node.js numbers as FLOAT64s, so they
// must be converted to strings before being inserted as INT64s
const request = {
  schema: [
    `CREATE TABLE gpiiKeys (
      gpiiKey STRING(36) NOT NULL,
      schemaVersion STRING(100),
      prefsSafeId STRING(36),
      revoked BOOL,
      revokedReason STRING(MAX),
      timestampCreated TIMESTAMP
    ) PRIMARY KEY (gpiiKey)`,

    `CREATE TABLE prefsSafes (
      prefsSafeId STRING(36) NOT NULL,
      schemaVersion STRING(100),
      prefsSafeType STRING(100),
      name STRING(MAX),
      preferences STRING(MAX),
      timestampCreated TIMESTAMP
    ) PRIMARY KEY (prefsSafeId)`,

    `CREATE TABLE gpiiAppInstallationAuthorizations (
      accessToken STRING(36) NOT NULL,
      schemaVersion STRING(100),
      clientId STRING(36),
      gpiiKey STRING(36),
      revoked BOOL,
      revokedReason STRING(MAX),
      timestampExpires TIMESTAMP
    ) PRIMARY KEY (accessToken)`,
  ],
};

async function createDB() {
    // Creates a database
    const [database, operation] = await instance.createDatabase(
        databaseId,
        request
    );

    console.log(`Waiting for operation on ${database.id} to complete...`);
    await operation.promise();

    console.log(`Created database ${databaseId} on instance ${instanceId}.`);
}

createDB();
