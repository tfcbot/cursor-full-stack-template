/**
 * Research Generation Request Adapter
 * 
 * This module provides a Lambda adapter for handling research generation requests.
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
import { RequestResearchInputSchema, RequestResearchInput, ResearchStatus, RequestResearchOutputSchema } from "@metadata/agents/research-agent.schema";
import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@metadata/saas-identity.schema';
import { Topic } from '@metadata/orchestrator.schema';
import { Queue } from '@metadata/orchestrator.schema';
import { topicPublisher } from '@lib/topic-publisher.adapter';
import { researchRepository } from '@agent-runtime/researcher/adapters/secondary/datastore.adapter';

/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the research generation use case.
 * The validUser parameter contains the user information returned by getUserInfo.
 */
const researchEventParser: EventParser<RequestResearchInput> = (
  event: APIGatewayProxyEventV2,
  validUser: ValidUser
) => {
  // Parse the request body
  if (!event.body) {
    throw new Error("Missing request body");
  }
  const parsedBody = JSON.parse(event.body);
  

  const parsedBodyWithIds = RequestResearchInputSchema.parse({
    ...parsedBody,
    ...validUser,

  });

  
  // Combine user information with parsed body
  return parsedBodyWithIds;   
};

/**
 * Configuration options for the research generation adapter
 */
const researchAdapterOptions: LambdaAdapterOptions = {
  requireAuth: false,
  requireBody: true,
  requiredFields: ['prompt']
};

/**
 * Creates an initial pending research entry in the database
 */
const createPendingResearch = async (input: RequestResearchInput) => {
  const initialResearch = RequestResearchOutputSchema.parse({
    researchId: input.id,
    userId: input.userId,
    title: `Research for: ${input.prompt.substring(0, 50)}...`,
    content: '',
    citation_links: [],
    status: ResearchStatus.PENDING,
  });

  await researchRepository.saveResearch(initialResearch);
};

/**
 * Use case for publishing a research generation request.
 * The input parameter will contain the complete request object returned by researchEventParser,
 * which includes the user information from getUserInfo.
 */
const publishMessageUsecase = async (input: RequestResearchInput) => {
  // Create a pending research entry
  const pendingResearch = await createPendingResearch(input);
  
  // Publish the message to the queue
  topicPublisher.publishAgentMessage({
    topic: Topic.task,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    queue: Queue.research,
    payload: input
  });
}

/**
 * Lambda adapter for handling research generation requests
 * 
 * This adapter:
 * 1. Validates the request body
 * 2. Parses and validates the input using researchEventParser
 * 3. Executes the research generation use case with the combined user and request data
 * 4. Formats and returns the response
 */
export const requestResearchAdapter = createLambdaAdapter({
  schema: RequestResearchInputSchema,
  useCase: publishMessageUsecase,
  eventParser: researchEventParser,
  options: researchAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.OK({ body: { message: 'Research generation request published' } })
}); 