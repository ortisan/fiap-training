import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as AWS from "aws-sdk";
export const REGION = "us-east-1";

AWS.config.update({ region: REGION });

export const dynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: false,
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

export const dynamoDBDocClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION }),
  translateConfig
);
