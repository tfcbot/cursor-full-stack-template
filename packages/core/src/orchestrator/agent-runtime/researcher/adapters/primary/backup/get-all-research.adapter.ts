/**
 * Get User Research Adapter
 * 
 * This module provides a Lambda adapter for retrieving research items for the authenticated user.
 * It uses the lambda adapter factory to create a standardized Lambda handler
 * with authentication, validation, and error handling.
 */

import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { 
  createLambdaAdapter, 
  EventParser,
  LambdaAdapterOptions 
} from '@lib/lambda-adapter.factory';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { getUserResearchUsecase } from '@agent-runtime/researcher/usecase/get-all-research.usecase';
import { z } from 'zod';
import { GetAllUserResearchInput, GetAllUserResearchInputSchema } from '@metadata/agents/research-agent.schema';
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { GetAllUserTasksInput } from "@metadata/agents/agent.schema";
import { HttpResponse } from "@utils/tools/http-status";
import { SaasIdentity } from "@utils/tools/saas-identity";
import { agentTaskRepository } from "../secondary/datastore.adapter";


/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the get user research use case
 */
const getAllResearchEventParser: EventParser<GetAllUserResearchInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  return {
    userId: validUser.userId
  };
};

/**
 * Configuration options for the get all user research adapter
 */
const getAllUserResearchAdapterOptions: LambdaAdapterOptions = {
  requireAuth: true,
  requireBody: false // GET requests don't have a body
};

/**
 * Lambda adapter for handling get user research requests
 * 
 * This adapter:
 * 1. Validates authentication
 * 2. Executes the get user research use case with the authenticated user's ID
 * 3. Formats and returns the response with the user's research items
 */
export const getAllUserResearchAdapter = createLambdaAdapter({
  schema: GetAllUserResearchInputSchema,
  useCase: getUserResearchUsecase,
  eventParser: getAllResearchEventParser,
  options: getAllUserResearchAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: result })
});

export const getAllUserTasksAdapter = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  try {
    const saasIdentity = new SaasIdentity(event);
    const userId = saasIdentity.getUserId();

    if (!userId) {
      return HttpResponse.unauthorized("User not authenticated");
    }

    const input: GetAllUserTasksInput = {
      userId
    };

    const tasks = await agentTaskRepository.getAllUserTasks(input);
    
    return HttpResponse.ok(tasks);
  } catch (error) {
    console.error("Error in getAllUserTasksAdapter:", error);
    return HttpResponse.internalServerError("Failed to retrieve tasks");
  }
};

// For backward compatibility
export const getAllUserResearchAdapter = getAllUserTasksAdapter;
