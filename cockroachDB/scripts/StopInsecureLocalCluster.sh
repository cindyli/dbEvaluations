#!/bin/sh

# Copyright 2019 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/GPII/universal/blob/master/LICENSE.txt

# Shuts down the database cluster and flushes its nodes

cockroach quit --insecure --host=localhost:26257
sleep 2
cockroach quit --insecure --host=localhost:26258
sleep 2
cockroach quit --insecure --host=localhost:26259
sleep 2
rm -rf node1 node2 node3