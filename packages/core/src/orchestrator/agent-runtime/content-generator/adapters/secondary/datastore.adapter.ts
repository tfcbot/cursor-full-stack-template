import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ContentRequestInput, ContentRequestOutput, ContentRequestOutputSchema } from "@metadata/agents/content-agent.schema";

import { z } from "zod";
import { Resource } from 'sst';

// Define the output type for growth strategy deliverables
export type ContentOutput = z.infer<typeof ContentRequestOutputSchema>;

// Set up DynamoDB client
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
