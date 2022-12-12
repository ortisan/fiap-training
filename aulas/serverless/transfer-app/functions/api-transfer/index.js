var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
 exports.handler = async (event, context) => {
     console.log(`Event: ${JSON.stringify(event)}`);
     
     var params = {
       Message: event.body,
       TopicArn: process.env.TOPIC_MOVEMENTS_ACCOUNT
     };
     
     const data = await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
     console.log("MessageID is " + data.MessageId);
     
     const response = {
         statusCode: 200,
         body: JSON.stringify('Transferência recebida.'),
     };
     return response;
 };
