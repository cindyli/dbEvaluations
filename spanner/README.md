## Cloud Spanner
This directory contains scripts for evaluating development features of Cloud Spanner.

## Setup
- Follow instructions to setup: https://googleapis.dev/nodejs/spanner/latest/#before-you-begin
  - Open a terminal to set up an environment variable: `export GOOGLE_APPLICATION_CREDENTIALS="/Users/cindyli/Downloads/spanner-credential.json"`
  - Log in locally by running `gcloud auth login`

  - Create a Cloud Spanner instance:
  `gcloud spanner instances create evaluate-spanner-instance --config=regional-us-central1 \
    --description="Evaluate Spanner Instance" --nodes=1`

## Evaluation details

Note that an evaluation summary can be found [in the repo README](../README.md).

| Feature | Detail |
| --- | --- |
| **Must have** |
| Save and retrieve "perferences" object | Yes. Save as stringified JSON. Spanner provides [JSON functions](https://cloud.google.com/spanner/docs/functions-and-operators#json-functions) to retrieve nested values/objects from JSON |
| Local emulator for development and running tests locally | Not offered by Google. A close work around is to [use a CockroachDB docker image](https://stackoverflow.com/questions/42289920/local-development-with-cloud-spanner). This work around may not work for us because CockroachDB supports standard SQLs while we will use Spanner's npm module that all SQLs need to go thru a non-SQL API. Here's a discussion about [CockroachDB vs Google Cloud Spanner](https://forum.cockroachlabs.com/t/cockroachdb-vs-google-cloud-spanner/691) |
| Failure reports | Yes. [Google example scripts](https://github.com/googleapis/nodejs-spanner/blob/master/samples/dml.js) |
| Indexing | Yes. Automatically create indexes for primary keys. Support user defined [secondary indexes](https://cloud.google.com/spanner/docs/secondary-indexes)|
| Good Documentation | Yes. See [here](https://cloud.google.com/spanner/docs/) |
| Credentials Required | Yes. (See [here](https://googleapis.dev/nodejs/spanner/latest/#before-you-begin)). |
| Licensing | Paid service. $300 credit for free trial. See [here](https://cloud.google.com/spanner/pricing). |
| **Nice to have (Optional)** |
| Query entities from more than one kind by a common property | Yes. Example script: queryWithJoin.js |
| Support DML-like OR when querying entities | Yes. Example script: queryWithOr.js |
| Be able to retrieve a targeted subset documents, such as by data type, username, et cetera. | Yes. Example script: queryWithOr.js |
| Shallow merge at the property level | Yes. common DML feature with UPDATE statements |
| Deep object merge for property values | No. JSON saved as strings |
| timestamp comparison | Yes. Example script: queryWithJoin.js |
| Views | No. The article about [optimizing schema design](https://cloud.google.com/spanner/docs/whitepapers/optimizing-schema-design) |
| Reuse current db schema | Yes |


## References:
- Google Cloud Spanner Documentation - https://cloud.google.com/spanner/docs/quickstart-console
- Github repo with node.js examples - https://github.com/googleapis/nodejs-spanner
- Google Cloud Spanner: the good, the bad and the ugly - https://medium.com/@LightspeedHQ/google-cloud-spanner-the-good-the-bad-and-the-ugly-5795f37a7684
