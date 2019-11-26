# Evaluation of Database Alternatives
This repo is to evaluate development features of 2 GCP supported databases:
- Firestore in datastore mode in `datastore/` sub-directory
- Cloud Spanner in `spanner/` sub-directory

## Setup
- Clone this repo: `git@github.com:cindyli/dbEvaluations.git`
- Refer to `README.md` in `datastore/` and `spanner/` directories for how to set up environment for each alternative and run evaluation scripts

## Evaluation Summary

The evaluation details can be found in the corresponding sub-directory.

| Feature | Firestore in datastore mode | Cloud Spanner | TiDB |
| --- | --- | --- | --- |
| **Must have** |
| Save and retrieve "perferences" object | Yes | Yes. Save as stringified JSON. Spanner provides JSON functions to retrieve nested values/objects from JSON | Yes |
| Query entities from more than one kind (table) by a common property | No | Yes | Yes |
| Support DML-like OR when querying entities | No | Yes | Yes |
| Local emulator for development and running tests locally | Yes | Not offered by Google. A close work around is to start CockroachDB in a docker container.| Yes |
| Failure reports | Yes | Yes | Yes |
| Indexing | Yes | Yes | Yes |
| Good Documentation | Yes | Yes | Yes |
| Credentials Required | No for using local emulator. Yes for accessing GCP instance. | Yes. Only tested the online GCP instance | Yes |
| Licensing | Paid service. Free quota that allows you to get started at no cost | Paid service. $300 credit for free trial. | Open Source under Apache License 2.0. |
| **Nice to have (Optional)** |
| Be able to retrieve a targeted subset documents, such as by data type, username, et cetera. | Yes | Yes | Yes |
| Shallow merge at the property level | Yes | Yes | Yes |
| Deep object merge for property values | No | No | Partial |
| timestamp comparison | Yes | Yes | Yes |
| Views | No | No | Yes |
| Reuse current db schema | No | Yes | Yes |
| Data type validation | No | Yes | Yes |
| Scalability when querying a nested JSON value | Yes | No | Partial |
| Unnecessary to explicitly define entity dependencies for fast query | Yes | No. Must carefully define interleaved tables to ensure each interleaved row is physically stored in the same split as its parent row to improve performance.| Yes |

Note:
1. Without the support of "Query entities from more than one kind by a common property". These current views can only be achieved by 2 queries: findPrefsSafeByGpiiKey, findClientByOauth2ClientId, findInfoByAccessToken
2. Without "Support DML-like OR when querying entities", the query like:
```
SELECT * FROM users WHERE email = {value} OR username = {value}
```
can only be achieved by 2 queries fetching `email = {value}` and `username = {value}` separately.
