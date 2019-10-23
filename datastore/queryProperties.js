// Conclusion: Support the query of kinds, entity names, entity properties.

// Imports the Google Cloud client library
var {Datastore} = require("@google-cloud/datastore");

// Creates a client
var datastore = new Datastore();

async function runPropertyQuery() {
    const query = datastore.createQuery('__property__').select('__key__');
    const [entities] = await datastore.runQuery(query);
    // @TODO convert below object to map
    const propertiesByKind = {};

    entities.forEach(entity => {
        const key = entity[datastore.KEY];
        const kind = key.path[1];
        const property = key.path[3];

        propertiesByKind[kind] = propertiesByKind[kind] || [];
            propertiesByKind[kind].push(property);
    });

    console.log('Properties by Kind:');
    for (const key in propertiesByKind) {
        console.log(key, propertiesByKind[key]);
    }

    return propertiesByKind;
}

runPropertyQuery();
