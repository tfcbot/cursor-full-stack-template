import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamoRepositoryFactory } from "../../../../../lib/dynamodb-repository.factory";
import { agentTasksTable } from "../../../../../../infra/database";
import { SaveAgentTaskInput, RequestAgentTaskOutput, GetAgentTaskInput, GetAllUserTasksInput } from "@metadata/agents/agent.schema";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const agentTaskRepository = {
  saveTask: async (task: SaveAgentTaskInput): Promise<RequestAgentTaskOutput> => {
    const repository = dynamoRepositoryFactory<SaveAgentTaskInput, RequestAgentTaskOutput>(
      agentTasksTable.tableName,
      docClient
    );
    return await repository.create(task);
  },
  getTaskById: async (input: GetAgentTaskInput): Promise<RequestAgentTaskOutput | null> => {
    const repository = dynamoRepositoryFactory<GetAgentTaskInput, RequestAgentTaskOutput>(
      agentTasksTable.tableName,
      docClient
    );
    return await repository.getById(input.taskId);
  },
  getAllUserTasks: async (input: GetAllUserTasksInput): Promise<RequestAgentTaskOutput[]> => {
    const repository = dynamoRepositoryFactory<GetAllUserTasksInput, RequestAgentTaskOutput>(
      agentTasksTable.tableName,
      docClient
    );
    return await repository.query("UserIdIndex", "userId", input.userId);
  }
};

// For backward compatibility
export const researchRepository = {
  saveResearch: async (research: any): Promise<any> => {
    return await agentTaskRepository.saveTask({
      ...research,
      taskId: research.researchId
    });
  },
  getResearchById: async (input: any): Promise<any> => {
    return await agentTaskRepository.getTaskById({
      ...input,
      taskId: input.researchId
    });
  },
  getAllUserResearch: async (input: any): Promise<any[]> => {
    return await agentTaskRepository.getAllUserTasks(input);
  }
};
