import index from "@functions/cdc-dynamodb-audit";
import type { AWS } from "@serverless/typescript";
import config from "config";

const serverlessConfiguration: AWS = {
  service: "hands-on-dynamodb",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline"
  ],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      AUDIT_CDC_BUCKET: config.bucketAudit,
    },
    stackName: "hands-on-serverless",
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
      name: process.env.DEPLOYMENT_BUCKET,
      serverSideEncryption: "AES256",
    },
  },
  functions: { "cdc-dynamodb-audit": index },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
