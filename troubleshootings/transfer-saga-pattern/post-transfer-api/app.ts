import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import { DynamoDB, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { PublishCommandInput, SNS } from '@aws-sdk/client-sns';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IllegalArgumentError, TransferDomain, TransferRequest, errorHandler } from 'commons';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(utc);
dayjs.extend(timezone);

const awsRegion = 'us-east-1';
const dynamodbClient = new DynamoDB({ region: awsRegion });
const snsClient = new SNS({ region: awsRegion });

const tracer = new Tracer({ serviceName: process.env.SERVICE_NAME, enabled: true });

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Received event', JSON.stringify(event));

    try {
        const data: TransferRequest = JSON.parse(event.body || '');

        console.log('Data', event.body);

        const now = dayjs().utc();
        const domain: TransferDomain = {
            id: uuidv4(),
            status: 'PENDING',
            accountFrom: data.accountFrom,
            accountTo: data.accountTo,
            amount: data.amount,
            date: now.format(),
            timestamp: now.unix(),
        };

        validate(domain);

        const putItemCommand: PutItemCommandInput = {
            TableName: process.env.TABLE_TRANSFER!,
            ReturnConsumedCapacity: 'TOTAL',
            Item: {
                id: {
                    S: domain.id,
                },
                status: {
                    S: domain.status,
                },
                accountFrom: {
                    S: domain.accountFrom,
                },
                accountTo: {
                    S: domain.accountTo,
                },
                amount: {
                    N: String(domain.amount),
                },
                date: {
                    N: String(domain.timestamp),
                },
            },
        };

        await dynamodbClient.putItem(putItemCommand);

        var sendNotificationCommand: PublishCommandInput = {
            Message: JSON.stringify(domain),
            TopicArn: process.env.TOPIC_TRANSFER_MOVEMENTS,
        };

        await snsClient.publish(sendNotificationCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({
                id: domain.id,
                details: 'Processing transaction...',
                date: domain.date,
                timestamp: domain.timestamp,
            }),
        };
    } catch (err) {
        return errorHandler(err, 'API');
    }
};

// Wrap the handler with middy
export const lambdaHandler = middy(handler)
    // Use the middleware by passing the Tracer instance as a parameter
    .use(captureLambdaHandler(tracer));

const validate = (domain: TransferDomain) => {
    const errors = [];
    if (!domain.accountFrom) {
        errors.push('From Account is required.');
    }
    if (!domain.accountTo) {
        errors.push('To Account is required.');
    }
    if (!domain.amount || domain.amount <= 0) {
        errors.push('Amount is required and must be grather than zero.');
    }
    if (errors.length > 0) {
        throw new IllegalArgumentError('Transfer request has errros.', errors);
    }
};
