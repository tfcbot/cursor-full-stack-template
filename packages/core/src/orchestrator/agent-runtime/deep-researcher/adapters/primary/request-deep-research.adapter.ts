/**
 * Deep Research Generation Request Adapter
 * 
 * This module provides a Lambda adapter for handling deep research generation requests.
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
import { RequestDeepResearchInputSchema, RequestDeepResearchInput } from "@metadata/agents/deep-research-agent.schema";
import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { Topic } from '@metadata/orchestrator.schema';
import { Queue } from '@metadata/orchestrator.schema';
import { topicPublisher } from '@lib/topic-publisher.adapter';


/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the deep research generation use case.
 * The validUser parameter contains the user information returned by getUserInfo.
 */
const deepResearchEventParser: EventParser<RequestDeepResearchInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Parse the request body
  if (!event.body) {
    throw new Error("Missing request body");
  }
  const parsedBody = JSON.parse(event.body);
  

  const parsedBodyWithIds = RequestDeepResearchInputSchema.parse({
    ...parsedBody,
    ...validUser,
    orderId: randomUUID(),
    deliverableId: randomUUID()
  });

  
  // Combine user information with parsed body
  return parsedBodyWithIds;   
};

/**
 * Configuration options for the deep research generation adapter
 */
const deepResearchAdapterOptions: LambdaAdapterOptions = {
  requireAuth: false,
  requireBody: true,
  requiredFields: ['prompt', 'contentType']
};


/**
 * Use case for publishing a deep research generation request.
 * The input parameter will contain the complete request object returned by deepResearchEventParser,
 * which includes the user information from getUserInfo.
 */
const publishMessageUsecase = async (input: RequestDeepResearchInput) => {
  topicPublisher.publishAgentMessage({
    topic: Topic.agent,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    queue: Queue.deepResearch,
    payload: {
      id: randomUUID(),
      message: input 
    }
  });
}

/**
 * Lambda adapter for handling deep research generation requests
 * 
 * This adapter:
 * 1. Validates the request body
 * 2. Parses and validates the input using deepResearchEventParser
 * 3. Executes the deep research generation use case with the combined user and request data
 * 4. Formats and returns the response
 */
export const requestDeepResearchAdapter = createLambdaAdapter({
  schema: RequestDeepResearchInputSchema,
  useCase: publishMessageUsecase,
  eventParser: deepResearchEventParser,
  options: deepResearchAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: { message: 'Deep research generation request published' } })
}); 