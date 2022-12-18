import { DynamoDB, GetItemCommandInput, GetItemCommandOutput, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { PublishCommandInput, SNS } from '@aws-sdk/client-sns';
import { SQSEvent, SQSHandler, SQSRecord } from 'aws-lambda';
import { AccountBalanceDomain, EffectiveMovementEvent, TransferDomain, errorHandler } from './commons';

const awsRegion = 'us-east-1';
const dynamodbClient = new DynamoDB({ region: awsRegion });
const snsClient = new SNS({ region: awsRegion });

export const lambdaHandler: SQSHandler = async (event: SQSEvent): Promise<void> => {
    console.log('Event received', JSON.stringify(event));

    await Promise.allSettled(
        event.Records.map(async (record: SQSRecord): Promise<void> => {
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
        }),
    );
    return;
};

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
