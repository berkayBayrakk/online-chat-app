import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  const command = new DeleteCommand({
      TableName: process.env.DYNAMO_CONNECTION_TABLE_NAME,
      Key: {
         connectionId: event.requestContext.connectionId,
      },
    });
  
  try {
    await docClient.send(command);
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500
      };
    }
      return {
      statusCode: 200,
    };
};

