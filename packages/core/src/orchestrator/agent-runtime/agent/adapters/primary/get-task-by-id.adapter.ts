/**
 * Get Task By ID Adapter
 * 
 * This module provides a Lambda adapter for retrieving a specific task by its ID.
 * It uses the lambda adapter factory to create a standardized Lambda handler
 * with authentication, validation, and error handling.
 */

import { createLambdaAdapter, EventParser, LambdaAdapterOptions } from '@lib/lambda-adapter.factory';
import { GetTaskInputSchema, GetTaskInput } from '@metadata/agents/agent.schema';
import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { getTaskUsecase } from '../../usecase/get-task.usecase';

/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the get task use case.
 */
const getTaskEventParser: EventParser<GetTaskInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Extract the task ID from the path parameters
  const agentId = event.pathParameters?.id;
  
  if (!agentId) {
    throw new Error('Missing task ID in path parameters');
  }
  
  return {
    agentId,
  };
};

/**
 * Configuration options for the get task adapter
 */
const getTaskAdapterOptions: LambdaAdapterOptions = {
  requireAuth: true,
  requireBody: false,
};

/**
 * Lambda adapter for retrieving a specific task by ID
 * 
 * This adapter:
 * 1. Extracts the task ID from the path parameters
 * 2. Validates the input using the GetTaskInputSchema
 * 3. Calls the getTaskUsecase to retrieve the task
 * 4. Returns the task data with a 200 status code
 */
export const getTaskByIdAdapter = createLambdaAdapter({
  schema: GetTaskInputSchema,
  useCase: getTaskUsecase,
  eventParser: getTaskEventParser,
  options: getTaskAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: result.data }),
});
