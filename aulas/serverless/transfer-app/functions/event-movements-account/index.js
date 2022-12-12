var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
exports.handler = async (event) => {
    console.log(`Event: ${JSON.stringify(event)}`);
    for (const rec of event.Records) {
        const transactionDocument = JSON.parse(rec.body);
        const notificationMessage = `Valor ${transactionDocument.amount} saindo da conta de ${transactionDocument.user_from}, e indo para a conta ${transactionDocument.user_to}`;
        var params = {
        Message: notificationMessage,
        TopicArn: process.env.TOPIC_CUSTOMER_NOTIFICATION
        };
        const data = await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
        console.log("MessageID is " + data.MessageId);
    };
    return true;
};