#!/bin/sh

# Copyright 2019 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/GPII/universal/blob/master/LICENSE.txt

# Starts up a local insecure cockroach database: a cluster of three nodes
# Creates a 'evaluate_cockroachdb' database and a 'maxroach' user

cockroach start --insecure --store=node1 --listen-addr=localhost:26257 --http-addr=localhost:8080 --join=localhost:26257,localhost:26258,localhost:26259 --background
sleep 2
cockroach start --insecure --store=node2 --listen-addr=localhost:26258 --http-addr=localhost:8081 --join=localhost:26257,localhost:26258,localhost:26259 --background
sleep 2
cockroach start --insecure --store=node3 --listen-addr=localhost:26259 --http-addr=localhost:8082 --join=localhost:26257,localhost:26258,localhost:26259 --background
sleep 2
cockroach init --insecure --host=localhost:26257

cockroach sql --insecure -e "
CREATE USER IF NOT EXISTS maxroach;
CREATE DATABASE evaluate_cockroachdb;
GRANT ALL ON DATABASE evaluate_cockroachdb TO maxroach;
"

echo "'evaluate_cockroachdb' initialized (empty)"