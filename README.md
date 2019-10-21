# Evaluation of Database Alternatives
This repo is to evaluate development features of 2 GCP supported databases:
- Firestore in datastore mode in `datastore/` sub-directory
- Cloud Spanner in `spanner/` sub-directory

## Setup
- Clone this repo
  ```
  git clone git@gist.github.com:73675a92b38d2d761016513754543d1c.git datastore-quick
  ```
- Refer to `README.md` in `datastore/` and `spanner/` directories for how to set up

## Evaluation Summary


### Firestore in datastore mode
Cons:
1. Datastore mode doesn't support to filter entities from more than one kind. For example, using one query to retrieve both gpiiKey and prefsSafe entities for a GPII key, which now becomes 2 queries by fetching these entities separately. This disadvantage will cause some one-step CouchDB views to be written into 2 queries. These views are: findPrefsSafeByGpiiKey, findClientByOauth2ClientId, findInfoByAccessToken

1. merge() function supports the shallow merge at the property level. It doesn't support the deep merge of a property value that is an object.

1. partial update on preferences
2. be able to return data from multiple kinds
