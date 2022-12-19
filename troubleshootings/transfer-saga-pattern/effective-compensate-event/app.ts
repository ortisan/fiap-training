import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import { DynamoDB, ExecuteStatementCommandInput } from '@aws-sdk/client-dynamodb';
import middy from '@middy/core';
import sqsPartialBatchFailure from '@middy/sqs-partial-batch-failure';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { EffectiveMovementEvent, errorHandler } from './commons';
const awsRegion = 'us-east-1';
const dynamodbClient = new DynamoDB({ region: awsRegion });

const tracer = new Tracer({ serviceName: process.env.SERVICE_NAME, enabled: true });

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
    console.log('Event received', JSON.stringify(event));

    const promises = event.Records.map(async (record: SQSRecord): Promise<void> => {
        try {
            console.log('Extracting data...');

            const effectiveMovementEvent: EffectiveMovementEvent = JSON.parse(record.body);
            const executeStatementCommand: ExecuteStatementCommandInput = {
                Statement: `UPDATE ${process.env.TABLE_TRANSFER} SET status=?, message=? where id=?`,
                Parameters: [
                    { S: effectiveMovementEvent.status },
                    { S: effectiveMovementEvent.message },
                    { S: effectiveMovementEvent.transferId },
                ],
            };
            await dynamodbClient.executeStatement(executeStatementCommand);
            return;
        } catch (err) {
            errorHandler(err, 'EVENT');
        }
    });

    return Promise.allSettled(promises);
};

// Wrap the handler with middy
export const lambdaHandler = middy(handler)
    // Use the middleware by passing the Tracer instance as a parameter
    .use(sqsPartialBatchFailure())
    .use(captureLambdaHandler(tracer));
