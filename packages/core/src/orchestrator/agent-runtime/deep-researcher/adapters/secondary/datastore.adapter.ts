import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createDeepResearchRepository } from './research.repository';

// Set up DynamoDB client
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));


export const deepResearchRepository = createDeepResearchRepository(dynamoDbClient);
