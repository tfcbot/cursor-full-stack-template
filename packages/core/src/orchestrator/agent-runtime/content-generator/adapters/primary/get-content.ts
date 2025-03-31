/**
 * Content Request Adapter
 * 
 * This module provides a Lambda adapter for handling content requests.
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
import { RequestContentInput, RequestContentInputSchema } from '@metadata/agents/content-agent.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { getContentUsecase } from '@agent-runtime/content-generator/usecases/get-content.usecase';




/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the content use case
 */
const contentEventParser: EventParser<RequestContentInput> = (
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
    prompt: eventBody.prompt
  };
};

/**
 * Configuration options for the content adapter
 */
const contentAdapterOptions: LambdaAdapterOptions = {
  requireAuth: false,
  requireBody: true,
  requiredFields: ['prompt']
};


/**
 * Lambda adapter for handling content requests
 * 
 * This adapter:
 * 1. Validates the request body
 * 2. Parses and validates the input using the schema
 * 3. Executes the content use case
 * 4. Formats and returns the response
 */
export const requestContentAdapter = createLambdaAdapter({
  schema: RequestContentInputSchema,
  useCase: getContentUsecase,
  eventParser: contentEventParser,
  options: contentAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: result })
});
