#!/bin/bash
set -x
awslocal dynamodb --endpoint-url=http://localstack:4566 create-table \
    --table-name Vehicles \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --stream-specification \
        StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --query 'TableDescription.LatestStreamArn' \
    --output text
set +x