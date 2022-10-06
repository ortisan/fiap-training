#!/bin/bash
set -x
awslocal opensearch create-domain --domain-name fiap-domain \
      --domain-endpoint-options '{ "CustomEndpoint": "http://localhost:4566/fiap-domain-endpoint", "CustomEndpointEnabled": true }'
set +x