# Real Time Online Chat App #

# Tech Stack

Frontend: React.js (S3)

Backend: WebSocket (AWS API Gateway + Lambda)

Database: DynamoDB (NOSQL)

# Lambda Functions
You can find lambda functions /src/lambdas folder
1. connect
Triggered when a user connects to WebSocket.
Stores the user's connection ID in the connections DynamoDB table.

2. disconnect
Triggered when a user disconnects from WebSocket.
Removes the user's connection ID from the connections DynamoDB table.

3. default
Handles chat messages sent over WebSocket.
Stores messages in the messages DynamoDB table.

# DynamoDB Tables
1. messages
Stores chat messages.

Schema:

MessageId: Unique ID for each message.

SenderName: Name of the message sender.

Content: The message content.

CreatedAt: Message sent timestamp.

2. connections
Stores active WebSocket connection IDs.

Schema:

ConnectionId: Unique connection ID.

# Deployment

Frontend

1. Build react app with `npm run build` command. 
2. Deploy build folder, configure S3 for static hosting.

Backend

1. Set up WebSocket API Gateway with routes:

    $connect → connect Lambda.
    $disconnect → disconnect Lambda.
    $default → default Lambda for messages.

2. Deploy Lambda functions and API Gateway.

# Environment Variables 

REACT_APP_WEBSOCKET_URL: WebSocket URL for the frontend.

AWS_REGION: AWS region name.

AWS_API_GATEWAY_ENDPOINT: AWS API Gateway endpoint.

DYNAMO_CONNECTION_TABLE_NAME: Connection table name.

DYNAMO_MESSAGE_TABLE_NAME: Message table name.
