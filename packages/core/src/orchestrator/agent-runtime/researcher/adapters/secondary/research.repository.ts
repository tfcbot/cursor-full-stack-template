import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { RequestResearchOutput, RequestResearchOutputSchema } from '@metadata/agents/research-agent.schema';
import { Resource } from 'sst';

export interface ResearchRepository {
  saveResearch(research: RequestResearchOutput): Promise<string>;
  getResearchById(researchId: string): Promise<RequestResearchOutput | null>;
  getResearchByUserId(userId: string): Promise<RequestResearchOutput[]>;
  getAllResearch(): Promise<RequestResearchOutput[]>;
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

      return RequestResearchOutputSchema.parse(response.Item);
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

      return response.Items.map((item) => RequestResearchOutputSchema.parse(item));
    },
    
    async getAllResearch(): Promise<RequestResearchOutput[]> {
      // Note: Scan operations should be used carefully in production as they can be expensive
      const response = await dynamoDbClient.send(
        new ScanCommand({
          TableName: tableName,
          Limit: 100, // Limiting the number of items to avoid excessive reads
        })
      );
      
      if (!response.Items || response.Items.length === 0) {
        return [];
      }
      
      return response.Items.map((item) => RequestResearchOutputSchema.parse(item));
    }
  };
};
