# Evaluate Firestore in Datastore Mode
This directory contains scripts for evaluating development features of Firestore in datastore mode.

## Setup
- In this directory, run `npm install`
- Follow "Before you begin" section to install Google Cloud Client - https://cloud.google.com/datastore/docs/tools/datastore-emulator

- The code can run against real Datastore online instance or Datastore mode emulator

  a. Datastore mode Emulator
     - Install the Emulator - `gcloud components install cloud-datastore-emulator`
     - Start the Datastore Emulator: Open a terminal and start the emulator - `gcloud beta emulators datastore start`
     - Open another terminal, set env variable - `export DATASTORE_EMULATOR_HOST=localhost:8081` and run scripts in this terminal
     Note: Follow instructions in the section "Setup GUI for Datastore Emulator" to set up a GUI locally for viewing and deleting data saved in the local emulator

  b. Real Datastore mode Cloud instances
     - [Enable Firestore API](https://console.cloud.google.com/flows/enableapi?apiid=firestore.googleapis.com)
     - Enable Fire store in Datastore mode(https://console.cloud.google.com/datastore/welcome) by selecting *Cloud Firestore in Datastore Mode*
     - Follow instructions to set up [Google authentication](https://cloud.google.com/docs/authentication/getting-started#auth-cloud-implicit-nodejs)
       - Open a terminal to set up an environment variable: `export GOOGLE_APPLICATION_CREDENTIALS="/Users/cindyli/Downloads/datastore-credential.json"`
       - Log in locally by running `gcloud auth login`

## Run scripts

- An example to run a script: `node create.js`
- Each script explores a development feature.

## Setup GUI for Datastore Emulator

- Install a third party library "dsui": `npm i -g @streamrail/dsui`
  If hitting "Error: EACCES: permission denied, access '/usr/local/lib/node_modules'", run:
  `sudo chown -R $USER /usr/local/lib/node_modules`
  then re-run `npm i -g @streamrail/dsui`
- Make sure Emulator has started in another terminal. If not, run `gcloud beta emulators datastore start`
- Find out Emulator environment variables - `gcloud beta emulators datastore env-init`
- Start "dsui" - `dsui -e localhost:8081 -r evaluate-fire-datastore`
- Access data in Emulator by accessing `http://localhost:3000` in a browser.

## Evaluation details

Note that an evaluation summary can be found [in the repo README](../README.md).

| Feature | Detail |
| --- | --- |
| **Must have** |
| Save and retrieve "perferences" object | Yes, Example script: create.js |
| Local emulator for development and running tests locally | Yes. How to setup: REAMDE.md |
| Failure reports | Yes. Google example script: [error.js](https://github.com/googleapis/nodejs-datastore/blob/master/samples/error.js) |
| Indexing | Yes. Support built-in indexes and user defined composite indexes. See [here](https://cloud.google.com/datastore/docs/concepts/indexes#composite_indexes) as well as [the best practices for indexes](https://cloud.google.com/datastore/docs/best-practices#indexes)|
| Good Documentation | Yes. See [here](https://cloud.google.com/datastore/docs/) |
| Credentials Required | No for using local emulator. Yes for accessing GCP instance (See [here](https://cloud.google.com/docs/authentication/getting-started#auth-cloud-implicit-nodejs)). |
| Licensing | Paid service. Free quota that allows you to get started at no cost. See [here](https://firebase.google.com/docs/firestore/pricing). |
| **Nice to have (Optional)** |
| Query entities from more than one kind by a common property | No. Example script: queryMultipleEntities.js |
| Support DML-like OR when querying entities | No |
| Be able to retrieve a targeted subset documents, such as by data type, username, et cetera. | Yes. Example script: querySubsets.js |
| Shallow merge at the property level | Yes. Example script: mergePrefs.js |
| Deep object merge for property values | No. Example script: mergePrefs.js |
| timestamp comparison | Yes. Example script: findExpiredAccessToken.js |
| Views | No |
| Reuse current db schema | No. Need a redesign with ancestors. |
| Data type validation | No. As a NO-SQL db, any data format can be saved in an entity. |
| Scalability when querying a nested JSON value | Yes |
| Unnecessary to explicitly define entity dependencies for fast query | Yes |

## References
- Cloud Firestore in Datastore mode Documentation - https://cloud.google.com/datastore/docs/
- API for Google Cloud Datastore: Node.js Client - https://googleapis.dev/nodejs/datastore/latest/index.html
- Github repo with Datastore node.js examples: https://github.com/googleapis/nodejs-datastore
- Emulator Datastore Viewer - https://github.com/streamrail/dsui
- Stepan's initial quick start - https://gist.github.com/stepanstipl/73675a92b38d2d761016513754543d1c
