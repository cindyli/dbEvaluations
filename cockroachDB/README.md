## CockroachDB/Sequelize
This folder contains shell and node scripts for evaluating CockroachDB with
Sequelize as a replacement for CouchDB.

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
| Support DML-like OR when querying entities | Yes.  See [DmlLikeORquery.js.js](./DmlLikeORquery.js) |
| Local emulator for development and running tests locally | Yes. Running CockroachDB cluster using Docker image: https://www.cockroachlabs.com/docs/stable/start-a-local-cluster-in-docker-mac.html. |
| Failure reports | Yes. Almost all `Sequelize` functions return a `Promise` |
| Indexing | TBD. |
| Good Documentation | Yes (see [References](#References) below).|
| Credentials Required | Run secure or insecure; only tested insecure |
| Licensing | <ul><li>CockroachDB: [BSL](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/) (Open Source until used commercially)</li><li>Sequelize: MIT</li></ul> |
| **Nice to have (Optional)** |
| Be able to retrieve a targeted subset of documents, such as by data type, username, et cetera. | Yes. See [join.js](./join.js).|
| Shallow merge at the property level | TBD.|
| Deep JSON object merge for property values | TBD.|
| Timestamp comparison | Yes. See [join.js](./join.js). |
| Views | TBD. |
| Reuse current db schema | TDB (likely). |
| Data type validation | Yes. |
| Scalability when querying a nested JSON value | TBD.|
| Unnecessary to explicitly define entity dependencies for fast query | TBD.|

## References:
- CockroachDB documentation:  https://www.cockroachlabs.com/docs/stable/install-cockroachdb-mac.html
- CockroachDB with Sequelize: https://www.cockroachlabs.com/docs/stable/build-a-nodejs-app-with-cockroachdb-sequelize.html
- Sequelize documentation: https://sequelize.readthedocs.io/en/v3/
- CockroachDB also provides an interactive SQL interpretter: https://www.cockroachlabs.com/docs/stable/learn-cockroachdb-sql.html