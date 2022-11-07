import {
  Context,
  DynamoDBBatchResponse,
  DynamoDBRecord,
  DynamoDBStreamEvent
} from "aws-lambda";
import * as AWS from "aws-sdk";
import { AuditEvent } from "./auditEvent";

const s3 = new AWS.S3({ region: "us-east-1" });
const bucketAudit = process.env.AUDIT_CDC_BUCKET;

export const handleStreamEvent = async (
  event: DynamoDBStreamEvent,
  context: Context
): Promise<DynamoDBBatchResponse | void> => {
  console.log("Event received", JSON.stringify(event));

  await Promise.allSettled(
    event.Records.map(async (record: DynamoDBRecord): Promise<AuditEvent> => {
      console.log("Extracting data...");

      const customerId = record.dynamodb.Keys.CustomerId.S;
      const orderId = record.dynamodb.Keys.OrderId.S;
      const eventTimestamp = record.dynamodb.ApproximateCreationDateTime;

      const auditEvent: AuditEvent = {
        eventType: record.eventName,
        eventTimestamp: record.dynamodb.ApproximateCreationDateTime,
        keys: record.dynamodb.Keys,
        newImage: record.dynamodb.NewImage,
        oldImage: record.dynamodb.OldImage,
      };

      const putItemParams = {
        Bucket: bucketAudit,
        Key: `${customerId}/${eventTimestamp}/${orderId}.json`,
        Body: JSON.stringify(auditEvent),
      };

      console.log("Uploading audit event:", JSON.stringify(putItemParams));
      await s3.upload(putItemParams).promise();
      console.log("Object persisted.");

      return auditEvent;
    })
  );
  return null;
};
