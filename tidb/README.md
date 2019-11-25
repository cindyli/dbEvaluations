## TiDB
This directory contains scripts for evaluating development features of TiDB.

## Setup
- Follow instructions for the initial setup: https://pingcap.com/blog/how_to_spin_up_an_htap_database_in_5_minutes_with_tidb_tispark/. Once setup,
  - To start TiDB docker containers, open a terminal and run:
  `cd {tidb-docker-compose path}; docker-compose up -d`

  - To stop TiDB docker containers, open a terminal and run:
  `cd {tidb-docker-compose path}; docker-compose stop`

  - Start mysql client to connect to TiDB:
  `mysql -h 127.0.0.1 -P 4000 -u root`

## Evaluation details

Note that an evaluation summary can be found [in the repo README](../README.md).

| Feature | Detail |
| --- | --- |
| **Must have** |
| Save and retrieve "perferences" object | Yes. Save as JSON data type. Able to retrieve/update values at nested paths. See [jsonOps.js](./jsonOps.js). TiDB doesn't support all MySQL supported JSON functions. See [TiDB unsupported functions](https://pingcap.com/docs/stable/reference/sql/functions-and-operators/json-functions/#unsupported-functions).|
| Query entities from more than one kind (table) by a common property | Yes. See [join.js](./join.js) |
| Support DML-like OR when querying entities | Yes. See [createDB.js](./createDB.js) and [createTables.js](./createTables.js). |
| Local emulator for development and running tests locally | Yes. TiDB docker composer: https://github.com/pingcap/tidb-docker-compose. |
| Failure reports | Yes. See [utils.js](./utils.js).|
| Indexing | Yes. Columns of type JSON can not be indexed directly but indexed using stored [generated column](https://pingcap.com/docs/stable/reference/sql/generated-columns/#index-json-using-stored-generated-column).|
| Good Documentation | Yes. TiDB documentation: https://pingcap.com/docs/stable/overview/. Since TiDB is compatible with MySQL, MySQL documentation applies too: https://dev.mysql.com/doc/refman/8.0/en/|
| Credentials Required | Yes. TiDB access privilege system: https://pingcap.com/docs/stable/reference/security/privilege-system/. |
| Licensing | Open source under Apache License 2.0. |
| **Nice to have (Optional)** |
| Be able to retrieve a targeted subset documents, such as by data type, username, et cetera. | Yes. See [join.js](./join.js).|
| Shallow merge at the property level | Yes. See [jsonOps.js](./jsonOps.js).|
| Deep JSON object merge for property values | Partial. Support the replacement of values at specified nested paths. See [jsonOps.js](./jsonOps.js).|
| timestamp comparison | Yes. See [join.js](./join.js). |
| Views | Yes. TiDB views are read-only and don't support write operations like UPDATE, INSERT, DELETE and so on - https://pingcap.com/docs/stable/reference/sql/views/#views. |
| Reuse current db schema | Yes |
| Data type validation | Yes |
| Scalability when querying a nested JSON value | Not discussed in the documentation. The experiments with TiDB docker composer on the local machine show the slowness after querying/updating JSON after a while. This may suggest the scalability on JSON operations may not supported automatically. However, as TiDB supports indexing frequently used JSON paths as generated column, the scalability on indexed JSON is supported.|
| Unnecessary to explicitly define entity dependencies for fast query | Yes.|

## References:
- TiDB Documentation - https://pingcap.com/docs/stable/overview/
- TiDB compatible NPM module mysql - https://www.npmjs.com/package/mysql
