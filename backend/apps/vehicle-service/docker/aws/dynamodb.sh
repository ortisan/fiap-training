#!/bin/bash
set -x
stream_arn=$(awslocal dynamodb --endpoint-url=http://localstack:4566 -- create-table \
    --table-name Vehicles \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=name,AttributeType=S \
        AttributeName=year,AttributeType=N \
        AttributeName=model,AttributeType=S \
        AttributeName=brand,AttributeType=S \
        AttributeName=licence_plate,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --query 'TableDescription.LatestStreamArn' \
    --output text)
set +x