// Conclusion: Support querying multiple entities by keys.
// Does not support querying entities from more than one kind that have a common property.
// Kindless queries(https://cloud.google.com/datastore/docs/concepts/queries#kindless_queries)
// in this example only supports one filter on an entity key.

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");

// Creates a client
var datastore = new Datastore();

async function query() {
    var results = await datastore.get([
        datastore.key(["gpiiKeys", "carla"]),
        datastore.key(["gpiiKeys", "carla", "prefsSafes", "carla"])
    ]);

    console.log("Results: ", results);
}

query();
