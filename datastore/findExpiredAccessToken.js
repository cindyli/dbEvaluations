// Conclusion: Support the timestamp comparison at least when the timestamp is saved as new Date().toJSON())

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");

// Compare timestamps. See example at:
// https://cloud.google.com/datastore/docs/concepts/queries#datastore-datastore-property-filter-nodejs#datastore-datastore-inequality-range-code-sample
var datastore = new Datastore();

async function find() {
    // The value of "timestampExpires" needs to be generated via: new Date().toJSON());
    var query = datastore.createQuery("gpiiAppInstallationAuthorizations")
        .filter("timestampExpires", "<", new Date().toJSON());
    var results = await datastore.runQuery(query);

    console.log("Expired: ", results);
}

find();
