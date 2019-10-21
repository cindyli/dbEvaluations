// Conclusion: Support the query on the kind that has an ancestor kind

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");

// Creates a client
var datastore = new Datastore();

async function querySnapset() {
    var query = datastore.createQuery("prefsSafes")
        .filter("prefsSafeType", "snapset");
    var [results] = await datastore.runQuery(query);

    console.log("All snapsets: ", results);
}

querySnapset();
