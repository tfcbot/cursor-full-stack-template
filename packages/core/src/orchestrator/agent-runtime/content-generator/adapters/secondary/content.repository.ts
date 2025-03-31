import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { RequestContentInput, RequestContentOutput } from '@metadata/agents/content-agent.schema';
import { ValidUser } from '@metadata/saas-identity.schema';

export interface ContentRepository {
  saveContent(userId: string, content: RequestContentOutput, prompt: string): Promise<string>;
  getContentById(contentId: string): Promise<RequestContentOutput | null>;
  getContentByUserId(userId: string): Promise<RequestContentOutput[]>;
}

export const createContentRepository = (
  dynamoDbClient: DynamoDBDocumentClient
): ContentRepository => {
  const tableName = process.env.CONTENT_TABLE_NAME || 'ContentTable';

  return {
    async saveContent(userId: string, content: RequestContentOutput, prompt: string): Promise<string> {
      const contentId = randomUUID();
      const timestamp = new Date().toISOString();

      await dynamoDbClient.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            contentId,
            userId,
            content: content.content,
            prompt,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        })
      );

      return contentId;
    },

    async getContentById(contentId: string): Promise<RequestContentOutput | null> {
      const response = await dynamoDbClient.send(
        new GetCommand({
          TableName: tableName,
          Key: {
            contentId,
          },
        })
      );

      if (!response.Item) {
        return null;
      }

      return {
        content: response.Item.content,
      };
    },

    async getContentByUserId(userId: string): Promise<RequestContentOutput[]> {
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
        content: item.content,
      }));
    },
  };
};
