## CockroachDB/Sequelize
This folder contains shell and node scripts for evaluating CockroachDB with
[Sequelize](https://sequelize.readthedocs.io/en/v3/) as a replacement for
CouchDB.

CockroachDB also supports the [pg](https://www.npmjs.com/package/pg) Node
Postgres driver that can be used instead of Sequelize.  This evaluation used the
Sequelize interface only.  However, a brief skim of the pg package suggests that
it provides a way make Postgres queries using node/javascript.  Sequelize also
provides that, as well as a way of expressing the queries in a JSON-like way.
For example, consider the following search query:

```
SELECT "preferences" FROM "prefsSafes" AS "prefsSafes" WHERE ("prefsSafes"."preferences"#>>'{flat,contexts,gpii-default,preferences}') IS NOT NULL AND "prefsSafes"."prefsSafeId" = 'prefsSafe-carla';
```

This `SELECT` can be written using the Sequelize Model function `findAll()` as
follows (models are how Sequelize represents `TABLE`s):

```
prefsSafesModel.findAll(
    {
        attributes: [ "preferences" ],
        where: {
            "preferences.flat.contexts.gpii-default.preferences": { $ne: null },
            prefsSafeId: "prefsSafe-carla"
        }
    }
);
```

## Setup
- Download and install CockroachDB and its Docker image.  Note that while there
  are instructions for Linux and Windows, the evaluation was carried out on the
  Mac version only.
  - Mac:
    - https://www.cockroachlabs.com/docs/stable/install-cockroachdb-mac.html
    - https://www.cockroachlabs.com/docs/stable/install-cockroachdb-mac.html#use-docker-1
  - Linux:
    - https://www.cockroachlabs.com/docs/stable/install-cockroachdb-linux.html
    - https://www.cockroachlabs.com/docs/stable/install-cockroachdb-linux.html#use-docker
  - Windows:
    - https://www.cockroachlabs.com/docs/stable/install-cockroachdb-windows.html
    - https://www.cockroachlabs.com/docs/stable/install-cockroachdb-windows.html#use-docker
- Create an empty database:
  - Run the `DockerStartInsecureCluster.sh` in the [`scripts`](./scripts) folder
  - Open a browser and go to `http://localhost:8080/#/databases/tables`.  There
    should be an empty `evaluate_cockroachdb` table listed near the top of the
    page
  - When done, run `DockerStopInsecureCluster.sh` to destroy the database.

## Evaluation details

Note that an evaluation summary can be found [in the repo README](../README.md).

| Feature | Detail |
| --- | --- |
| **Must have** |
| Save and retrieve `preferences` object | Yes, see [loadDataBase.js](./loadDataBase.js), [join.js](./join.js) |
| Query entities from more than one kind (table) by a common property | Yes. See [join.js](./join.js) |
| Support DML-like OR when querying entities | Yes.  See [dmLikeOrQuery.js](./dmLikeOrQuery.js) |
| Local emulator for development and running tests locally | Yes. Running CockroachDB cluster using Docker image: https://www.cockroachlabs.com/docs/stable/start-a-local-cluster-in-docker-mac.html. |
| Failure reports | Yes. Almost all `Sequelize` functions return a `Promise` |
| Indexing | <ul><li>CockroachDB: indexing JSON field is not yet implemented ([createIndex.js](./createIndex.js)): https://github.com/cockroachdb/cockroach/issues/35730</li><li>Sequelize: Yes, but does not support computed indices: https://github.com/cockroachdb/cockroach/issues/9682</li></ul> |
| Good Documentation | Yes on balance.  Some complex queries are poorly documented (see [References](#References) below).|
| Credentials Required | Run secure or insecure; only tested insecure |
| Licensing | <ul><li>CockroachDB: [BSL](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/) (Open Source until used commercially)</li><li>Sequelize: MIT</li></ul> |
| **Nice to have (Optional)** |
| Be able to retrieve a targeted subset of documents, such as by data type, username, et cetera. | Yes. See [join.js](./join.js).|
| Shallow merge at the property level | Yes. See [jsonOps.js](.jsonOps.js) |
| Deep JSON object merge for property values | Partial support for setting values of specified nested paths using `json_set()`.  See [jsonOps.js](.jsonOps.js). May be fully supported using `json_build_object()` -- not tested.|
| Timestamp comparison | Yes. See [join.js](./join.js). |
| Views | No out-of-the-box support.  Preliminary support: https://github.com/abelosorio/sequelize-views-support. |
| Reuse current db schema | Yes. |
| Data type validation | Yes. |
| Scalability when querying a nested JSON value | Somewhat: Use inverted index to optimize JSONB performance.<ul><li>A [blog post](https://www.cockroachlabs.com/blog/json-coming-to-cockroach/) notes that JSONB reads are fast, but writes are slower -- see the "When should I use structured data instead of JSONB?" section.</li><li>There is a [tutorial](https://www.cockroachlabs.com/docs/v19.2/demo-json-support.html#step-8-create-an-inverted-index-to-optimize-performance) on using an `INVERTED INDEX` to speed up JSONB queries (not tested).</li></ul> |
| Unnecessary to explicitly define entity dependencies for fast query | Interleaving tables can improve performance.  See immediately [below](#entity-dependencies). |

### Entity Dependencies

The necessity, or lack thereof, to expicitly define entity dependencies for
improved performance relates to Cloudspanner and its need to use [interleaved
tables](https://cloud.google.com/spanner/docs/schema-and-data-model#creating-interleaved-tables)
for performance improvements.  CockroachDB supports interleaved tables and [the
documentation](https://www.cockroachlabs.com/docs/stable/interleave-in-parent.html)
states that this generally leads to _much_ faster reads, writes, and joins.
However, there are [caveats](https://www.cockroachlabs.com/docs/stable/interleave-in-parent.html#when-to-interleave-tables):
- reads and deletes are slower for ranges, e.g., `WHERE column > value`.
- optimization diminishes as the data size for a primary key value of the root
table exceeds a key-value range maximum size (default 64mb).
- interleaving works best for representing hierarchies.  The `gpiiKey`, `prefsSafes`,
and `gpiiAppInstallationAuthorization` tables share some columns, but the
hierarchy is not very deep.

## References:
- CockroachDB documentation:  https://www.cockroachlabs.com/docs/stable/install-cockroachdb-mac.html
- CockroachDB with Sequelize: https://www.cockroachlabs.com/docs/stable/build-a-nodejs-app-with-cockroachdb-sequelize.html
- Sequelize documentation: https://sequelize.readthedocs.io/en/v3/
- CockroachDB also provides an interactive SQL interpretter: https://www.cockroachlabs.com/docs/stable/learn-cockroachdb-sql.html