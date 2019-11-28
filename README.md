# Evaluation of Database Alternatives
This repo is to evaluate development features of 2 GCP supported databases:
- Firestore in datastore mode in `datastore/` sub-directory
- Cloud Spanner in `spanner/` sub-directory

## Setup
- Clone this repo: `git@github.com:cindyli/dbEvaluations.git`
- Refer to `README.md` in `datastore/` and `spanner/` directories for how to set up environment for each alternative and run evaluation scripts

## Evaluation Summary

The evaluation details can be found in the corresponding sub-directory.

| Feature | Firestore in datastore mode | Cloud Spanner | TiDB | CockroachDB/Sequelize |
| --- | --- | --- | --- | --- |
| **Must have** |
| Save and retrieve "perferences" object | Yes | Yes. Save as stringified JSON. Spanner provides JSON functions to retrieve nested values/objects from JSON | Yes | Yes |
| Query entities from more than one kind (table) by a common property | No | Yes | Yes | TBD |
| Support DML-like OR when querying entities | No | Yes | Yes | TBD |
| Local emulator for development and running tests locally | Yes | Not offered by Google. A close work around is to start CockroachDB in a docker container.| Yes | Yes: both a local database as well as using Docker containers |
| Failure reports | Yes | Yes | Yes | TBD |
| Indexing | Yes | Yes | Yes | TBD |
| Good Documentation | Yes | Yes | Yes | Yes |
| Credentials Required | No for using local emulator. Yes for accessing GCP instance. | Yes. Only tested the online GCP instance | Yes | No (run secure or insecure) |
| Licensing | Paid service. Free quota that allows you to get started at no cost | Paid service. $300 credit for free trial. | Open Source under Apache License 2.0. | <ul><li>CockroachDB: [BSL](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/) (Open Source until used commercially)</li><li>Sequelize: MIT</li> |
| **Nice to have (Optional)** |
| Be able to retrieve a targeted subset documents, such as by data type, username, et cetera. | Yes | Yes | Yes | Yes |
| Shallow merge at the property level | Yes | Yes | Yes | TBD |
| Deep object merge for property values | No | No | Partial | TBD |
| timestamp comparison | Yes | Yes | Yes | TBD |
| Views | No | No | Yes | TBD |
| Reuse current db schema | No | Yes | Yes | TBD |
| Data type validation | No | Yes | Yes | Yes |
| Scalability when querying a nested JSON value | Yes | No | Partial | TBD |
| Unnecessary to explicitly define entity dependencies for fast query | Yes | No. Must carefully define interleaved tables to ensure each interleaved row is physically stored in the same split as its parent row to improve performance.| Yes | TBD |

Note:
1. Without the support of "Query entities from more than one kind by a common property". These current views can only be achieved by 2 queries: findPrefsSafeByGpiiKey, findClientByOauth2ClientId, findInfoByAccessToken
2. Without "Support DML-like OR when querying entities", the query like:
```
SELECT * FROM users WHERE email = {value} OR username = {value}
```
can only be achieved by 2 queries fetching `email = {value}` and `username = {value}` separately.
