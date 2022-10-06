#!/bin/bash
set -x
awslocal kinesis create-stream \
    --stream-name vehiclestream1 \
    --shard-count 1
set +x