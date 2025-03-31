/**
 * Content Generation Request Adapter
 * 
 * This module provides a Lambda adapter for handling content generation requests.
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
import { RequestContentInputSchema, RequestContentInput } from "@metadata/agents/content-agent.schema";
import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { Topic } from '@metadata/orchestrator.schema';
import { Queue } from '@metadata/orchestrator.schema';
import { topicPublisher } from '@lib/topic-publisher.adapter';


/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the content generation use case.
 * The validUser parameter contains the user information returned by getContentUserInfo.
 */
const contentEventParser: EventParser<RequestContentInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Parse the request body
  if (!event.body) {
    throw new Error("Missing request body");
  }
  const parsedBody = JSON.parse(event.body);
  

  const parsedBodyWithIds = RequestContentInputSchema.parse({
    ...parsedBody,
    ...validUser,
    orderId: randomUUID(),
    deliverableId: randomUUID()
  });

  
  // Combine user information with parsed body
  return parsedBodyWithIds;   
};

/**
 * Configuration options for the content generation adapter
 */
const contentAdapterOptions: LambdaAdapterOptions = {
  requireAuth: false,
  requireBody: true,
  requiredFields: ['prompt', 'contentType']
};


/**
 * Use case for publishing a content generation request.
 * The input parameter will contain the complete request object returned by contentEventParser,
 * which includes the user information from getContentUserInfo.
 */
const publishMessageUsecase = async (input: RequestContentInput) => {
  topicPublisher.publishAgentMessage({
    topic: Topic.agent,
    queue: Queue.content,
    payload: {
      id: randomUUID(),
      message: input 
    }
  });
}

/**
 * Lambda adapter for handling content generation requests
 * 
 * This adapter:
 * 1. Validates the request body
 * 2. Parses and validates the input using contentEventParser
 * 3. Executes the content generation use case with the combined user and request data
 * 4. Formats and returns the response
 */
export const requestContentAdapter = createLambdaAdapter({
  schema: RequestContentInputSchema,
  useCase: publishMessageUsecase,
  eventParser: contentEventParser,
  options: contentAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: { message: 'Content generation request published' } })
}); 