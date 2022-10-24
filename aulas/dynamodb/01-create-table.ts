import { dynamoDB } from "./client";

const params = {
  AttributeDefinitions: [
    {
      AttributeName: "Id",
      AttributeType: "N"
    },
    {
      AttributeName: "Email",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "Id",
      KeyType: "HASH"
    },
    {
      AttributeName: "Email",
      KeyType: "RANGE"
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: "UsersProg",
  StreamSpecification: {
    StreamEnabled: false
  }
};

dynamoDB.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});