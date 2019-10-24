// Conclusion: Support querying a subset documents.

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");

// Creates a client
var datastore = new Datastore();

async function queryByName() {
    var results = await datastore.runQuery(
        datastore.createQuery("prefsSafes").filter("name", "=", "alice")
    );

    console.log("queryByName Results: ", results);
}

async function queryByKind() {
    var results = await datastore.runQuery(
        datastore.createQuery("prefsSafes")
    );

    console.log("queryByKind Results: ", results);
}

queryByName();
queryByKind();
