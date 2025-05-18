import { DynamoDBClient,PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;

  const params = {
    TableName: process.env.DYNAMO_CONNECTION_TABLE_NAME,
    Item: {
      connectionId: { S: connectionId },
    },
  };
  try {
    await dynamoDb.send(new PutItemCommand(params));
    return { statusCode: 200, body: 'Connected.' };
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect' };
  }
};
