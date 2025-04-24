/**
 * Get All User Tasks Adapter
 * 
 * This module provides a Lambda adapter for retrieving all tasks for a specific user.
 * It uses the lambda adapter factory to create a standardized Lambda handler
 * with authentication, validation, and error handling.
 */

import { createLambdaAdapter, EventParser, LambdaAdapterOptions } from '@lib/lambda-adapter.factory';
import { GetAllUserTasksInputSchema, GetAllUserTasksInput } from '@metadata/agents/agent.schema';
import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { getUserTasksUsecase } from '../../usecase/get-all-tasks.usecase';

/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the get all user tasks use case.
 */
const getAllUserTasksEventParser: EventParser<GetAllUserTasksInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Extract the user ID from the authenticated user
  return {
    userId: validUser.userId,
  };
};

/**
 * Configuration options for the get all user tasks adapter
 */
const getAllUserTasksAdapterOptions: LambdaAdapterOptions = {
  requireAuth: true,
  requireBody: false,
};

/**
 * Lambda adapter for retrieving all tasks for a user
 * 
 * This adapter:
 * 1. Extracts the user ID from the authenticated user
 * 2. Validates the input using the GetAllUserTasksInputSchema
 * 3. Calls the getUserTasksUsecase to retrieve all tasks for the user
 * 4. Returns the task data with a 200 status code
 */
export const getAllUserTasksAdapter = createLambdaAdapter({
  schema: GetAllUserTasksInputSchema,
  useCase: getUserTasksUsecase,
  eventParser: getAllUserTasksEventParser,
  options: getAllUserTasksAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: result.data }),
});
