import { handlerPath } from "@libs/handler-resolver";
import config from "../../../config";

export default {
  handler: `${handlerPath(__dirname)}/handler.lambdaHandler`,
  events: [
    {
      stream: config.dynamodbArn,
    },
  ],
};
