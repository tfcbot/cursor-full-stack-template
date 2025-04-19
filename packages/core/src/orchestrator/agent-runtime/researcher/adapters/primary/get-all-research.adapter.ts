/**
 * Get All Research Adapter
 * 
 * This module provides a Lambda adapter for retrieving all research items.
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
import { getAllResearchUsecase } from '@agent-runtime/researcher/usecase/get-all-research.usecase';
import { z } from 'zod';

// Empty schema since we don't need any specific input for getting all research
const GetAllResearchSchema = z.object({});

// Define the type based on the schema
type GetAllResearchRequest = z.infer<typeof GetAllResearchSchema>;

/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the get all research use case
 */
const getAllResearchEventParser: EventParser<GetAllResearchRequest> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // No specific parsing needed - returning empty object
  return {};
};

/**
 * Configuration options for the get all research adapter
 */
const getAllResearchAdapterOptions: LambdaAdapterOptions = {
  requireAuth: false,
  requireBody: false // GET requests don't have a body
};

/**
 * Lambda adapter for handling get all research requests
 * 
 * This adapter:
 * 1. Validates there's no specific input needed
 * 2. Executes the get all research use case
 * 3. Formats and returns the response with all research items
 */
export const getAllResearchAdapter = createLambdaAdapter({
  schema: GetAllResearchSchema,
  useCase: async () => {
    return await getAllResearchUsecase();
  },
  eventParser: getAllResearchEventParser,
  options: getAllResearchAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: result })
}); 