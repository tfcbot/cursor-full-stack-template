/**
 * Research Request Adapter
 * 
 * This module provides a Lambda adapter for handling research requests.
 * It uses the lambda adapter factory to create a standardized Lambda handler
 * with authentication, validation, and error handling.
 */

import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { 
  createLambdaAdapter, 
  EventParser,
  LambdaAdapterOptions 
} from '@lib/lambda-adapter.factory';
import { GetResearchInput, GetResearchInputSchema } from '@metadata/agents/research-agent.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { getResearchUsecase } from '@agent-runtime/researcher/usecase/get-research.usecase';
import { getAllResearchUsecase } from '../../../researcher/usecase/get-all-research.usecase';
import { z } from 'zod';

// Create a custom schema that can handle both null (for all research) and GetResearchInput (for specific ID)
const ResearchRequestSchema = z.union([
  GetResearchInputSchema,
  z.literal(null)
]);

// Define the type based on the schema
type ResearchRequest = z.infer<typeof ResearchRequestSchema>;

/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the research use case
 */
const getResearchEventParser: EventParser<ResearchRequest> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Check if this is a request for a specific research item or all research
  const researchId = event.pathParameters?.id;
  
  // If no ID is provided, return null to indicate we want all research
  if (!researchId) {
    return null;
  }
  
  // Return the specific research request
  return {
    userId: validUser.userId,
    researchId: researchId
  };
};

/**
 * Configuration options for the research adapter
 */
const researchAdapterOptions: LambdaAdapterOptions = {
  requireAuth: false,
  requireBody: false // GET requests don't have a body
};

/**
 * Lambda adapter for handling research requests
 * 
 * This adapter:
 * 1. Checks if this is a request for all research or a specific research item
 * 2. Validates the input using the schema if applicable
 * 3. Executes the appropriate research use case
 * 4. Formats and returns the response
 */
export const getResearchAdapter = createLambdaAdapter({
  schema: ResearchRequestSchema, // Use our union schema to handle both null and input object
  useCase: async (input: ResearchRequest) => {
    // If input is null, get all research
    if (input === null) {
      return await getAllResearchUsecase();
    }
    
    // Otherwise, get specific research
    return await getResearchUsecase(input);
  },
  eventParser: getResearchEventParser,
  options: researchAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: result })
}); 