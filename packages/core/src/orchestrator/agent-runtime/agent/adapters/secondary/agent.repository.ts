import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SaveTaskInput, RequestTaskOutput, RequestTaskOutputSchema } from '@metadata/agents/agent.schema';
import { Resource } from 'sst';

export interface AgentRepository {
  saveTask(task: SaveTaskInput): Promise<string>;
  getTaskById(agentId: string): Promise<RequestTaskOutput | null>;
  getTasksByUserId(userId: string): Promise<RequestTaskOutput[]>;
}

export const createAgentRepository = (
  dynamoDbClient: DynamoDBDocumentClient
): AgentRepository => {
  const tableName = Resource.Agent.name
  console.info("Saving task to table", tableName);
  return {
    async saveTask(task: SaveTaskInput): Promise<string> {

      await dynamoDbClient.send(
        new PutCommand({
          TableName: tableName,
          Item: task
        })
      );

      return "Task saved successfully";
    },

    async getTaskById(agentId: string): Promise<RequestTaskOutput | null> {
      const response = await dynamoDbClient.send(
        new GetCommand({
          TableName: tableName,
          Key: {
            agentId,
          },
        })
      );

      if (!response.Item) {
        return null;
      }

      return RequestTaskOutputSchema.parse(response.Item);
    },

    async getTasksByUserId(userId: string): Promise<RequestTaskOutput[]> {
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

      return response.Items.map((item) => RequestTaskOutputSchema.parse(item));
    }
  };
};
