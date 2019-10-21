// Conclusion: Does not support querying properties from more than one kind.
// Kindless queries(https://cloud.google.com/datastore/docs/concepts/queries#kindless_queries)
// in this example only supports one filter on entity keys.

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");

// Creates a client
var datastore = new Datastore();

async function query() {
    // must provide a kind
    var query = datastore.createQuery()
        // .filter('__key__', '=', datastore.key(["gpiiKeys", "carla"]))
        .filter('__key__', '>', datastore.key(["gpiiKeys", "carla", "prefsSafes", "carla"]));
    var results = await datastore.runQuery(query);

    console.log("All snapsets: ", results);
}

query();
