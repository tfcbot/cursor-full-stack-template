/**
 * Agent Repository Adapter
 * 
 * This module provides a repository interface for interacting with the agent data store.
 * It handles CRUD operations for agent tasks.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { SaveTask, RequestTaskOutput } from "@metadata/agents/agent.schema";

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Table name for agent data
const AGENT_TABLE = process.env.AGENT_TABLE || "Agent";

/**
 * Agent repository for data storage operations
 */
export const agentRepository = {
  /**
   * Save a task to the database
   * 
   * @param task - The task to save
   * @returns A message indicating success
   */
  saveTask: async (task: SaveTask): Promise<string> => {
    try {
      const command = new PutCommand({
        TableName: AGENT_TABLE,
        Item: task,
      });
      
      await docClient.send(command);
      return "Task saved successfully";
    } catch (error) {
      console.error("Error saving task:", error);
      throw new Error("Failed to save task");
    }
  },
  
  /**
   * Get a task by its ID
   * 
   * @param agentId - The ID of the task to retrieve
   * @returns The task data or null if not found
   */
  getTaskById: async (agentId: string): Promise<RequestTaskOutput | null> => {
    try {
      const command = new GetCommand({
        TableName: AGENT_TABLE,
        Key: {
          agentId,
        },
      });
      
      const response = await docClient.send(command);
      
      if (!response.Item) {
        return null;
      }
      
      return response.Item as RequestTaskOutput;
    } catch (error) {
      console.error("Error getting task by ID:", error);
      throw new Error("Failed to get task");
    }
  },
  
  /**
   * Get all tasks for a specific user
   * 
   * @param userId - The ID of the user
   * @returns An array of tasks belonging to the user
   */
  getTasksByUserId: async (userId: string): Promise<RequestTaskOutput[]> => {
    try {
      const command = new QueryCommand({
        TableName: AGENT_TABLE,
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      });
      
      const response = await docClient.send(command);
      
      if (!response.Items || response.Items.length === 0) {
        return [];
      }
      
      return response.Items as RequestTaskOutput[];
    } catch (error) {
      console.error("Error getting tasks by user ID:", error);
      throw new Error("Failed to get user tasks");
    }
  },
};
