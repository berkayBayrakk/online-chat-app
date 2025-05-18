import { DynamoDBClient, PutItemCommand,ScanCommand } from '@aws-sdk/client-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });
const apiGateway = new ApiGatewayManagementApiClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_API_GATEWAY_ENDPOINT, 
});
export const handler = async (event) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  
  //when user enters the system, ws sends old chat message with user.
  if(body.type === 'GET_CHAT'){
    const ddbcommand = new ScanCommand({
      TableName: process.env.DYNAMO_MESSAGE_TABLE_NAME,
      })
    let messages;
    try { messages = await dynamoDb.send(ddbcommand);
    } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
    };
    }
    const data = messages.Items.map((item) => {
      return {
        name: item.name.S,
        message: item.message.S,
        time: parseInt(item.createdAt.N)
      };
    });
    try {
      await apiGateway.send(new PostToConnectionCommand(
        { ConnectionId: event.requestContext.connectionId, 
          Data: JSON.stringify({chat: data, type: 'OLD_MESSAGES'}), }
      ));
    } catch (e) {
    console.log(e);
    }
    return{
      statusCode: 200,
      body: JSON.stringify({message:'Old messages sent.'}),
    }
  
  }
  const name = body.body.name;
  const message = body.body.message;

  const params = {
    TableName: process.env.DYNAMO_MESSAGE_TABLE_NAME, 
    Item: {
      "createdAt": { N: Date.now().toString() },
      "name": { S: name }, 
      "message": { S: message },    
      "id": { S: `${Date.now()}-${Math.floor(Math.random() * 1e6)}` },    
    },
  };

  try {
    const command = new PutItemCommand(params);
 
    const data = await dynamoDb.send(command);
  
    const ddbcommand = new ScanCommand({
      TableName: process.env.DYNAMO_CONNECTION_TABLE_NAME,
      })
    let connections;
    try { connections = await dynamoDb.send(ddbcommand);
    } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
    };
    }

    const sendMessages = connections.Items.map(async ({connectionId}) => {
      if (connectionId.S !== event.requestContext.connectionId) {
        try {
          await apiGateway.send(new PostToConnectionCommand(
            { ConnectionId: connectionId.S, Data: JSON.stringify({message: message, user: name, type: 'NEW_MESSAGE'}), }
          ));
        } catch (e) {
        console.log(e);
        }
      }
      });
      try {
        await Promise.all(sendMessages)
        } catch (e) {
        console.log(e);
        return {
          statusCode: 500,
        };
        }

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.log("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error inserting data', error: error.message }),
    };
  }
};
