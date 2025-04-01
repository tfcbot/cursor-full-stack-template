import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { RequestResearchInput, RequestResearchOutput } from '@metadata/agents/research-agent.schema';
import { ValidUser } from '@metadata/saas-identity.schema';

export interface ResearchRepository {
  saveResearch(userId: string, research: RequestResearchOutput, prompt: string): Promise<string>;
  getResearchById(researchId: string): Promise<RequestResearchOutput | null>;
  getResearchByUserId(userId: string): Promise<RequestResearchOutput[]>;
}

export const createResearchRepository = (
  dynamoDbClient: DynamoDBDocumentClient
): ResearchRepository => {
  const tableName = process.env.RESEARCH_TABLE_NAME || 'ResearchTable';

  return {
    async saveResearch(userId: string, research: RequestResearchOutput, prompt: string): Promise<string> {
      const researchId = randomUUID();
      const timestamp = new Date().toISOString();

      await dynamoDbClient.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            researchId,
            userId,
            research: research.research,
            prompt,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        })
      );

      return researchId;
    },

    async getResearchById(researchId: string): Promise<RequestResearchOutput | null> {
      const response = await dynamoDbClient.send(
        new GetCommand({
          TableName: tableName,
          Key: {
            researchId,
          },
        })
      );

      if (!response.Item) {
        return null;
      }

      return {
        userId: response.Item.userId,
        research: response.Item.research,
      };
    },

    async getResearchByUserId(userId: string): Promise<RequestResearchOutput[]> {
      const response = await dynamoDbClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
        })
      );

      if (!response.Items || response.Items.length === 0) {
        return [];
      }

      return response.Items.map((item) => ({
        userId: item.userId,
        research: item.research,
      }));
    },
  };
};
