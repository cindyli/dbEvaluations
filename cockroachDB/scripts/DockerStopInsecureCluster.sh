#!/bin/sh

# Copyright 2019 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/GPII/universal/blob/master/LICENSE.txt

# Shuts down the docker database cluster, removes the docker containers, shuts
# down the "roachnet" network, and removes the log files.

echo "Stopping the containers for the cockroachdb nodes.."
docker stop cockroachdb roach2 roach3

echo "Removing the containers..."
docker rm cockroachdb roach2 roach3

echo "Shutting down the cockroachdb network..."
docker network rm roachnet

echo "Removing the log files".
rm -rf "${PWD}/cockroach-data"
