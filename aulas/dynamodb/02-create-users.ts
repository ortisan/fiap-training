import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { faker } from "@faker-js/faker/locale/pt_BR";
import * as AWS from "aws-sdk";
import { dynamoDBDocClient } from "./client";

AWS.config.update({ region: "us-east-1" });

export const USERS: User[] = [];

export interface User {
  Id: string;
  Email: string;
}

export function createRandomUser(): User {
  return {
    Id: faker.datatype.uuid(),
    Email: faker.internet.email(),
  };
}

export const putUsers = async () => {
  await Array.from({ length: 50 }).forEach(async () => {
    const user = createRandomUser();
    const params = {
      TableName: "Users",
      Item: user,
    };

    try {
      const data = await dynamoDBDocClient.send(new PutCommand(params));
      console.log("Success - item added or updated", data);
    } catch (err) {
      console.log("Error", err);
    }
  });
};

putUsers();
