# Evaluate Firestore in Datastore Mode
This directory contains scripts for evaluating development features of Firestore in datastore mode.

## Setup
- Clone github repo
- In `datastore/` sub-directory, run `npm install`
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
     - Log in locally by running `gcloud auth login`

## Run scripts

- An example to run a script: `node create.js`
- Each script is to explore one development feature. A summary of conclusions can be found [here](../README.md).

## Setup GUI for Datastore Emulator

- Install a third party library "dsui": `npm i -g @streamrail/dsui`
  If hitting "Error: EACCES: permission denied, access '/usr/local/lib/node_modules'", run:
  `sudo chown -R $USER /usr/local/lib/node_modules`
  then re-run `npm i -g @streamrail/dsui`
- Make sure Emulator has started in another terminal. If not, run `gcloud beta emulators datastore start`
- Find out Emulator environment variables - `gcloud beta emulators datastore env-init`
- Start "dsui" - `dsui -e localhost:8081 -r evaluate-fire-datastore`
- Access data in Emulator by accessing `http://localhost:3000` in a browser.

## References
- Cloud Firestore in Datastore mode Documentation - https://cloud.google.com/datastore/docs/
- API for Google Cloud Datastore: Node.js Client - https://googleapis.dev/nodejs/datastore/latest/index.html
- Github repo with Datastore node.js examples: https://github.com/googleapis/nodejs-datastore
- Emulator Datastore Viewer - https://github.com/streamrail/dsui
