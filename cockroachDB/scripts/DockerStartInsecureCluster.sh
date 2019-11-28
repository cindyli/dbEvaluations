#!/bin/sh

# Copyright 2019 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/GPII/universal/blob/master/LICENSE.txt

# Starts up an insecure cockroach database using a docker image: a cluster of three nodes
# A prerequisite is the cockroachDB docker image:
#   $ docker pull cockroachdb/cockroach:v19.2.0
#
# Note the docker image is preset to use these ports:
# - 26257/tcp for accessing the database
# - 8080/tcp for the web-based admin viewer

COCKROACHDB_IMAGE=cockroachdb/cockroach:v19.2.0
LISTEN_PORT=26257
COCKROACHDB_PORT=8080

docker network create -d bridge roachnet

echo "STARTING cockroachdb cluster in docker containers ..."
docker run -d \
--name=cockroachdb \
--hostname=roach1 \
--net roachnet \
-p $LISTEN_PORT:$LISTEN_PORT -p $COCKROACHDB_PORT:$COCKROACHDB_PORT \
-v "${PWD}/cockroach-data/roach1:/cockroach/cockroach-data" \
$COCKROACHDB_IMAGE start --insecure --join=roach1,roach2,roach3

docker run -d \
--name=roach2 \
--hostname=roach2 \
--net=roachnet \
-v "${PWD}/cockroach-data/roach2:/cockroach/cockroach-data" \
$COCKROACHDB_IMAGE start --insecure --join=roach1,roach2,roach3

docker run -d \
--name=roach3 \
--hostname=roach3 \
--net=roachnet \
-v "${PWD}/cockroach-data/roach2:/cockroach/cockroach-data" \
$COCKROACHDB_IMAGE start --insecure --join=roach1,roach2,roach3

docker exec -it cockroachdb ./cockroach init --insecure

echo "Creating 'evaluate_cockroachdb' database ..."
docker exec -d cockroachdb ./cockroach sql --insecure -e "
CREATE USER IF NOT EXISTS maxroach;
CREATE DATABASE evaluate_cockroachdb;
GRANT ALL ON DATABASE evaluate_cockroachdb TO maxroach;
"

echo "'evaluate_cockroachdb' initialized (empty)"
