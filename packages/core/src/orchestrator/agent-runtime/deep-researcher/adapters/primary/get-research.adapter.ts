/**
 * Deep Research Request Adapter
 * 
 * This module provides a Lambda adapter for handling deep research requests.
 * It uses the lambda adapter factory to create a standardized Lambda handler
 * with authentication, validation, and error handling.
 */

import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { 
  createLambdaAdapter, 
  EventParser,
  LambdaAdapterOptions 
} from '@lib/lambda-adapter.factory';
import { randomUUID } from 'crypto';
import { GetResearchInput, GetResearchInputSchema } from '@metadata/agents/deep-research-agent.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { getResearchUsecase } from '@agent-runtime/deep-researcher/usecase/get-research.usecase';




/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the deep research use case
 */
const getResearchEventParser: EventParser<GetResearchInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Parse the request body
  if (!event.body) {
    throw new Error("Missing request body");
  }
  
  const eventBody = JSON.parse(event.body);
  
  // Generate IDs manually
  const orderId = randomUUID();
  const deliverableId = randomUUID();
  
  return {
    userId: validUser.userId,
    researchId: eventBody.researchId,
    prompt: eventBody.prompt
  };
};

/**
 * Configuration options for the deep research adapter
 */
const deepResearchAdapterOptions: LambdaAdapterOptions = {
  requireAuth: false,
  requireBody: true,
  requiredFields: ['researchId']
};


/**
 * Lambda adapter for handling deep research requests
 * 
 * This adapter:
 * 1. Validates the request body
 * 2. Parses and validates the input using the schema
 * 3. Executes the deep research use case
 * 4. Formats and returns the response
 */
export const getResearchAdapter = createLambdaAdapter({
  schema: GetResearchInputSchema,
  useCase: getResearchUsecase,
  eventParser: getResearchEventParser,
  options: deepResearchAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: result })
}); 