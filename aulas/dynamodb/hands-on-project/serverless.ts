import type { AWS } from "@serverless/typescript";

import index from "@functions/cdc-dynamodb";

const serverlessConfiguration: AWS = {
  service: "hands-on-dynamodb",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],

  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      AUDIT_CDC_BUCKET: "env:AUDIT_CDC_BUCKET",
    },
    stackName: "hands-on-dynamodb",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Resource: "*",
            Action: [
              "s3:*",
              "dynamodb:GetRecords",
              "dynamodb:GetShardIterator",
              "dynamodb:DescribeStream",
              "dynamodb:ListStreams",
            ],
          },
        ],
      },
    },
    deploymentBucket: {
      name: "bucket-deployments-marcelo",
      serverSideEncryption: "AES256",
    },
  },
  functions: { "cdc-dynamodb": index },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
