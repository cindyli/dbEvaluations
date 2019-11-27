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

echo "STARTING NODE 1"
docker run --name=cockroachdb $COCKROACHDB_IMAGE start --insecure --store=node1 --listen-addr=localhost:26257 --http-addr=localhost:8080 --join=localhost:26257,localhost:26258,localhost:26259 &
echo "SLEEPING"; sleep 2; echo "AWAKE";
echo "STARTING NODE 2"
docker exec cockroachdb /cockroach/cockroach.sh start --insecure --store=node2 --listen-addr=localhost:26258 --http-addr=localhost:8081 --join=localhost:26257,localhost:26258,localhost:26259 --background
echo "SLEEPING"; sleep 2; echo "AWAKE";
#echo "STARTING NODE 3"
#docker exec cockroachdb /cockroach/cockroach.sh start --insecure --store=node3 --listen-addr=localhost:26259 --http-addr=localhost:8082 --join=localhost:26257,localhost:26258,localhost:26259 --background
#echo "SLEEPING"; sleep 2; echo "AWAKE";
echo "INITIALIZING DATABASE"
docker exec cockroachdb /cockroach/cockroach.sh init --insecure --host=localhost:26257 &
