// Conclusion: support the save of JSON

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");
var fs = require("fs");

// Creates a client
var datastore = new Datastore();

async function createGpiiKey(name) {
    // 1. Create a GPII key
    var kindForGpiiKey = "gpiiKeys";

    // The Cloud Datastore key for the new entity
    var keyForGpiiKey = datastore.key([kindForGpiiKey, name]);

    // Prepares a gpiiKey entity
    var task = {
        key: keyForGpiiKey,
        data: JSON.parse(fs.readFileSync("./data/gpiiKey-" + name + ".json")),
    };

    // Saves the GPII key. If the key already exists, the entity will be updated.
    console.log("Saving GPII key for: ", name);
    await datastore.save(task);

    // Read back GPII key
    var gpiiKey = await datastore.get(keyForGpiiKey);
    console.log("1. Read-back of saved GPII key: ", gpiiKey);

    // 2. create the prefs safe as a child of its key
    var kindForPrefsSafe = "prefsSafes";
    var keyForPrefsSafe = datastore.key([kindForGpiiKey, name, kindForPrefsSafe, name]);
    var task = {
        key: keyForPrefsSafe,
        data: JSON.parse(fs.readFileSync("./data/prefsSafe-" + name + ".json")),
    };

    console.log("Saving prefs safe for: ", name);
    await datastore.save(task);

    var prefsSafe = await datastore.get(keyForPrefsSafe);
    console.log("2. Read-back of saved prefs safe: ", prefsSafe);
    console.log("Directly access the preferences as an object: ", prefsSafe[0].preferences.flat.contexts["gpii-default"].preferences);

    // An example to access the key object
    console.log("Access the key object of an entity: ", prefsSafe[0][datastore.KEY]);
}

async function createEntity(kind, id) {
    var key = datastore.key([kind, id]);

    var task = {
        key: key,
        data: JSON.parse(fs.readFileSync("./data/" + id + ".json")),
    };

    // save
    await datastore.save(task);

    // Read back
    var savedEntity = await datastore.get(key);
    console.log("Read-back of saved entity: ", savedEntity);
}

createGpiiKey("alice");
createGpiiKey("carla");
createGpiiKey("user1");
createEntity("gpiiAppInstallationAuthorizations", "expiredAccessToken")
createEntity("gpiiAppInstallationAuthorizations", "unexpiredAccessToken")
