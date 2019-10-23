# Evaluation of Database Alternatives
This repo is to evaluate development features of 2 GCP supported databases:
- Firestore in datastore mode in `datastore/` sub-directory
- Cloud Spanner in `spanner/` sub-directory

## Setup
- Clone this repo: `git@github.com:cindyli/dbEvaluations.git`
- Refer to `README.md` in `datastore/` and `spanner/` directories for how to set up environment for each alternative and run evaluation scripts

## Evaluation Summary

The evaluation details can be found in the corresponding sub-directory.

| Feature | Firestore in datastore mode | Cloud Spanner |
| --- | --- | --- |
| **Must have** |
| Save and retrieve "perferences" object | Yes | Yes. Save as stringified JSON. Spanner provides JSON functions to retrieve nested values/objects from JSON |
| Local emulator for development and running tests locally | Yes | Not offered by Google. A close work around is to start CockroachDB in a docker container.|
| Failure reports | Yes | Yes |
| Indexing | Yes | Yes |
| Good Documentation | Yes | Yes |
| Credentials Required | No for using local emulator. Yes for accessing GCP instance. | Yes. Only tested the online GCP instance |
| Licensing | Paid service. Free quota that allows you to get started at no cost | Paid service |
| **Nice to have (Optional)** |
| Query entities from more than one kind by a common property | No | Yes |
| Support DML-like OR when querying entities | No | Yes |
| Shallow merge at the property level | Yes | Yes |
| Deep object merge for property values | No | No |
| timestamp comparison | Yes | Yes |
| Views | No | No |
| Reuse current db schema | No | Yes |

Note:
1. Without the support of "Query entities from more than one kind by a common property". These current views can only be achieved by 2 queries: findPrefsSafeByGpiiKey, findClientByOauth2ClientId, findInfoByAccessToken
2. Without "Support DML-like OR when querying entities", the query like:
```
SELECT * FROM users WHERE email = {value} OR username = {value}
```
can only be achieved by 2 queries fetching `email = {value}` and `username = {value}` separately.
