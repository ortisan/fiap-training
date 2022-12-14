import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import { DynamoDB, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AccountBalanceDomain, AccountBalanceRequest, IllegalArgumentError, errorHandler } from 'commons';

const awsRegion = 'us-east-1';
const dynamodbClient = new DynamoDB({ region: awsRegion });

const tracer = new Tracer({ serviceName: process.env.SERVICE_NAME, enabled: true });

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Received event', JSON.stringify(event));

    try {
        const data: AccountBalanceRequest = JSON.parse(event.body || '');

        console.log('Data', event.body);

        const domain: AccountBalanceDomain = {
            account: data.account,
            amount: data.amount,
        };

        validate(domain);

        const putItemCommand: PutItemCommandInput = {
            TableName: process.env.TABLE_ACCOUNT_BALANCE!,
            ReturnConsumedCapacity: 'TOTAL',
            Item: {
                id: {
                    S: domain.account,
                },
                amount: {
                    N: String(domain.amount),
                },
            },
        };

        await dynamodbClient.putItem(putItemCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({
                account: domain.account,
                details: 'Added account balance.',
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

const validate = (domain: AccountBalanceDomain) => {
    const errors = [];
    if (!domain.account) {
        errors.push('Account is required.');
    }
    if (!domain.amount || domain.amount <= 0) {
        errors.push('Amount is required and must be grather than zero.');
    }
    if (errors.length > 0) {
        throw new IllegalArgumentError('Add account balance request has errros.', errors);
    }
};
