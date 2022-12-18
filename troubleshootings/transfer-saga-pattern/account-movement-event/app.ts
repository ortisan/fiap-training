import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import { DynamoDB, GetItemCommandInput, GetItemCommandOutput, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { PublishCommandInput, SNS } from '@aws-sdk/client-sns';
import middy from '@middy/core';
import sqsPartialBatchFailure from '@middy/sqs-partial-batch-failure';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { AccountBalanceDomain, EffectiveMovementEvent, TransferDomain, errorHandler } from './commons';

const awsRegion = 'us-east-1';
const dynamodbClient = new DynamoDB({ region: awsRegion });
const snsClient = new SNS({ region: awsRegion });

const tracer = new Tracer({ serviceName: process.env.SERVICE_NAME });

export const handler = async (event: SQSEvent): Promise<PromiseSettledResult<void>[]> => {
    console.log('Event received', JSON.stringify(event));

    const promises = event.Records.map(async (record: SQSRecord): Promise<void> => {
        try {
            console.log('Extracting data...');

            const transferDomain: TransferDomain = JSON.parse(record.body);

            console.log('Domain', JSON.stringify(transferDomain));

            const getAccountFromCommand: GetItemCommandInput = {
                Key: {
                    id: {
                        S: transferDomain.accountFrom,
                    },
                },
                TableName: process.env.TABLE_ACCOUNT_BALANCE,
            };

            const getAccountTo: GetItemCommandInput = {
                Key: {
                    id: {
                        S: transferDomain.accountTo,
                    },
                },
                TableName: process.env.TABLE_ACCOUNT_BALANCE,
            };

            const accountFromBalanceDbItem = await dynamodbClient.getItem(getAccountFromCommand);
            const accountToBalanceDbItem = await dynamodbClient.getItem(getAccountTo);

            console.log('Item database From', JSON.stringify(accountFromBalanceDbItem));
            console.log('Item database To', JSON.stringify(accountToBalanceDbItem));

            if (!accountFromBalanceDbItem) {
                throw Error(`Account ${transferDomain.accountFrom} not found.`);
            }
            if (!accountToBalanceDbItem) {
                throw Error(`Account ${transferDomain.accountTo} not found.`);
            }

            let accountFromBalance = parseDynamoToDomain(accountFromBalanceDbItem);
            let accountToBalance = parseDynamoToDomain(accountToBalanceDbItem);

            accountFromBalance = addBalance(accountFromBalance, transferDomain.amount * -1);
            accountToBalance = addBalance(accountFromBalance, transferDomain.amount);

            if (accountFromBalance.amount < 0) {
                const effectiveMovementEvent: EffectiveMovementEvent = {
                    transferId: transferDomain.id,
                    status: 'FAILED',
                    message: 'Insufficient balance.',
                };
                var sendNotificationCommand: PublishCommandInput = {
                    Message: JSON.stringify(effectiveMovementEvent),
                    TopicArn: process.env.TOPIC_MONEY_MOVEMENT_ACCOUNT,
                };

                console.log('Sending notification fail message:', sendNotificationCommand);

                await snsClient.publish(sendNotificationCommand);

                return;
            }

            await dynamodbClient.putItem(getPutItemCommand(accountFromBalance));
            await dynamodbClient.putItem(getPutItemCommand(accountToBalance));

            const effectiveMovementEvent: EffectiveMovementEvent = {
                transferId: transferDomain.id,
                status: 'SUCESS',
                message: 'Movement occur.',
            };
            var sendNotificationCommand: PublishCommandInput = {
                Message: JSON.stringify(effectiveMovementEvent),
                TopicArn: process.env.TOPIC_MONEY_MOVEMENT_ACCOUNT,
            };

            console.log('Sending notification success message:', sendNotificationCommand);

            await snsClient.publish(sendNotificationCommand);
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
    .use(captureLambdaHandler(tracer))
    .use(sqsPartialBatchFailure());

const parseDynamoToDomain = (getItem: GetItemCommandOutput): AccountBalanceDomain => {
    const accountBalance: AccountBalanceDomain = {
        account: getItem!.Item!['id']!.S!,
        amount: +getItem.Item!['ammount'].N!,
    };
    return accountBalance;
};

const addBalance = (accountBalance: AccountBalanceDomain, amountToAdd: number): AccountBalanceDomain => {
    return { ...accountBalance, amount: accountBalance.amount + amountToAdd };
};

const getPutItemCommand = (accountBalance: AccountBalanceDomain) => {
    const putItemCommand: PutItemCommandInput = {
        TableName: process.env.TABLE_ACCOUNT_BALANCE!,
        ReturnConsumedCapacity: 'TOTAL',
        Item: {
            id: {
                S: accountBalance.account,
            },
            amount: {
                N: String(accountBalance.amount),
            },
        },
    };
    return putItemCommand;
};
