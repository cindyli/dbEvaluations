// Conclusion: The merge only occurs at the property level. Deep merge is not supported.

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");

// Creates a client
var datastore = new Datastore();

async function merge() {
    var key = datastore.key(["gpiiKeys", "carla", "prefsSafes", "carla"]);

    var [before] = await datastore.get(key);
    console.log("Carla record BEFORE the merge: ", before);
    console.log("Carla prefs BEFORE the merge: ", before.preferences.flat.contexts["gpii-default"]);

    var results = await datastore.merge({
        key: key,
        data: {
            schemaVersion: "0.3",   // will be merged at the property level
            preferences: {   // will replace the old prefs value
                flat: {
                    contexts: {
                        "gpii-default": {
                            "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                                "mag-factor": 5
                            },
                            "http://registry.gpii.net/common/fontSize": 36
                        }
                    }
                }
            }
        }
    });

    var [after] = await datastore.get(key);
    console.log("Carla record AFTER the merge: ", after);
    console.log("Carla prefs AFTER the merge: ", after.preferences.flat.contexts["gpii-default"]);
}

merge();
