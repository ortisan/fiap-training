import { DynamoDB, ExecuteStatementCommandInput } from '@aws-sdk/client-dynamodb';
import { SQSEvent, SQSHandler, SQSRecord } from 'aws-lambda';
import { EffectiveMovementEvent, errorHandler } from './commons';

const awsRegion = 'us-east-1';
const dynamodbClient = new DynamoDB({ region: awsRegion });

export const lambdaHandler: SQSHandler = async (event: SQSEvent): Promise<void> => {
    console.log('Event received', JSON.stringify(event));

    await Promise.allSettled(
        event.Records.map(async (record: SQSRecord): Promise<void> => {
            try {
                console.log('Extracting data...');

                const effectiveMovementEvent: EffectiveMovementEvent = JSON.parse(record.body);

                const executeStatementCommand: ExecuteStatementCommandInput = {
                    Statement: `UPDATE ${process.env.TABLE_TRANSFER}"  SET status=? where id=?`,
                    Parameters: [{ S: effectiveMovementEvent.status }, { S: effectiveMovementEvent.transferId }],
                };
                await dynamodbClient.executeStatement(executeStatementCommand);
                
                return;
            } catch (err) {
                errorHandler(err, 'EVENT');
            }
        }),
    );
    return;
};
