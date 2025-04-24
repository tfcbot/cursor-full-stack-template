/**
 * Task Generation Request Adapter
 * 
 * This module provides a Lambda adapter for handling task generation requests.
 * It uses the lambda adapter factory to create a standardized Lambda handler
 * with authentication, validation, and error handling.
 */
import { randomUUID } from 'crypto';
import { 
    createLambdaAdapter, 
    EventParser,
    LambdaAdapterOptions,
    GetUserInfo
  } from '@lib/lambda-adapter.factory';
import { RequestTaskInputSchema, RequestTaskInput, TaskStatus, PendingTaskSchema } from "@metadata/agents/agent.schema";
import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { apiKeyService } from '@utils/vendors/api-key-vendor';
import { UpdateUserCreditsCommand } from '@metadata/credits.schema';
import { runTaskUsecase } from '../../usecase/task.usecase';
import { agentRepository } from '@agent-runtime/agent/adapters/secondary/datastore.adapter';

/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the task generation use case.
 * The validUser parameter contains the user information returned by getUserInfo.
 */
const taskEventParser: EventParser<RequestTaskInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Parse the request body
  if (!event.body) {
    throw new Error("Missing request body");
  }
  const parsedBody = JSON.parse(event.body);
  

  const parsedBodyWithIds = RequestTaskInputSchema.parse({
    ...parsedBody,
    ...validUser,

  });

  
  // Combine user information with parsed body
  return parsedBodyWithIds;   
};

/**
 * Configuration options for the task generation adapter
 */
const taskAdapterOptions: LambdaAdapterOptions = {
  requireAuth: true,
  requireBody: true,
  requiredFields: ['prompt']
};

/**
 * Decrement user credits
 */
const decrementUserCredits = async (input: UpdateUserCreditsCommand) => {
  await apiKeyService.updateUserCredits({
    userId: input.userId,
    keyId: input.keyId,
    operation: 'decrement',
    amount: 1
  });
};

/**
 * Creates an initial pending task entry in the database
 */
const createPendingTask = async (input: RequestTaskInput) => {
  await decrementUserCredits({
      userId: input.userId,
      keyId: input.keyId,
      operation: 'decrement',
      amount: 1
  });

  const initialTask = PendingTaskSchema.parse({
    agentId: input.id,
    userId: input.userId,
    title: `Task for: ${input.prompt.substring(0, 50)}...`,
    content: '',
    citation_links: [],
    taskStatus: TaskStatus.PENDING,
  });

  await agentRepository.saveTask(initialTask);
  return initialTask;
};

/**
 * Use case for directly executing task request.
 * This replaces the previous message publishing approach with direct execution.
 * The function creates a pending entry, returns it immediately, and then
 * asynchronously processes the task request.
 */
const executeTaskUsecase = async (input: RequestTaskInput) => {
  // Create a pending task entry
  const pendingTask = await createPendingTask(input);
  
  // Start the task process asynchronously
  // We don't await this so we can return the pending state immediately
  runTaskUsecase(input).catch(error => {
    console.error('Error executing task:', error);
    // In a production system, you might want to update the task status to ERROR
    // and provide error details in the database
  });

  // Return the pending task entry immediately
  return pendingTask;
}

/**
 * Lambda adapter for handling task generation requests
 * 
 * This adapter:
 * 1. Validates the request body
 * 2. Parses and validates the input using taskEventParser
 * 3. Creates a pending task entry and returns it immediately with a 202 status
 * 4. Asynchronously executes the task process
 */
export const requestTaskAdapter = createLambdaAdapter({
  schema: RequestTaskInputSchema,
  useCase: executeTaskUsecase,
  eventParser: taskEventParser,
  options: taskAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.ACCEPTED({ body: result })
});
