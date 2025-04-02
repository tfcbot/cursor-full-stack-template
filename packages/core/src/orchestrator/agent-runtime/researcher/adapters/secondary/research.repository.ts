import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { RequestResearchInput, RequestResearchOutput } from '@metadata/agents/research-agent.schema';
import { ValidUser } from '@metadata/saas-identity.schema';
import { Resource } from 'sst';

export interface ResearchRepository {
  saveResearch(research: RequestResearchOutput): Promise<string>;
  getResearchById(researchId: string): Promise<RequestResearchOutput | null>;
  getResearchByUserId(userId: string): Promise<RequestResearchOutput[]>;
}

export const createResearchRepository = (
  dynamoDbClient: DynamoDBDocumentClient
): ResearchRepository => {
  const tableName = Resource.Research.name
  console.info("Saving research to table", tableName);
  return {
    async saveResearch(research: RequestResearchOutput): Promise<string> {

      await dynamoDbClient.send(
        new PutCommand({
          TableName: tableName,
          Item: research
        })
      );

      return "Research saved successfully";
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
        researchId: response.Item.researchId,
        title: response.Item.title,
        content: response.Item.content,
        createdAt: response.Item.createdAt,
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
        researchId: item.researchId,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt,
      }));
    },
  };
};
