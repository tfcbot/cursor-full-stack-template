import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { RequestDeepResearchInput, RequestDeepResearchOutput } from '@metadata/agents/deep-research-agent.schema';
import { ValidUser } from '@metadata/saas-identity.schema';

export interface DeepResearchRepository {
  saveDeepResearch(userId: string, research: RequestDeepResearchOutput, prompt: string): Promise<string>;
  getDeepResearchById(researchId: string): Promise<RequestDeepResearchOutput | null>;
  getDeepResearchByUserId(userId: string): Promise<RequestDeepResearchOutput[]>;
}

export const createDeepResearchRepository = (
  dynamoDbClient: DynamoDBDocumentClient
): DeepResearchRepository => {
  const tableName = process.env.DEEP_RESEARCH_TABLE_NAME || 'DeepResearchTable';

  return {
    async saveDeepResearch(userId: string, research: RequestDeepResearchOutput, prompt: string): Promise<string> {
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

    async getDeepResearchById(researchId: string): Promise<RequestDeepResearchOutput | null> {
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

    async getDeepResearchByUserId(userId: string): Promise<RequestDeepResearchOutput[]> {
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
