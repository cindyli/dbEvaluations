#!/bin/sh

# Copyright 2019 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/GPII/universal/blob/master/LICENSE.txt

# Shuts down the database cluster and flushes its nodes


#docker exec cockroachdb /cockroach/cockroach.sh quit --insecure --host=localhost:26259
#sleep 2
docker exec cockroachdb /cockroach/cockroach.sh quit --insecure --host=localhost:26258
sleep 2
docker exec cockroachdb /cockroach/cockroach.sh quit --insecure --host=localhost:26257
sleep 2
docker rm -f cockroachdb