/**
 * Growth Strategy Request Adapter
 * 
 * This module provides a Lambda adapter for handling growth strategy requests.
 * It uses the lambda adapter factory to create a standardized Lambda handler
 * with authentication, validation, and error handling.
 */
import { RequestGrowthStrategyInputSchema, RequestGrowthStrategyInput, GrowthStrategyOrder } from "@metadata/agents/growth-strategist.schema";
import { OrchestratorHttpResponses } from '@metadata/http-responses.schema';
import { 
  createLambdaAdapter, 
  EventParser,
  LambdaAdapterOptions 
} from '@lib/lambda-adapter.factory';
import { randomUUID } from 'crypto';
import { updateCreditsAdapter } from "src/control-plane/billing/adapters/primary/update-remaining-credits.adapter";
import { Queue, Topic, AgentCost } from "@metadata/orders.schema";
import { createOrderProcessor } from "@lib/publisher.factory";
import { orderManagerAdapter } from "@orchestrator/adapters/router/orders.adapters";
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser } from '@utils/metadata/saas-identity.schema';

/**
 * Parser function that transforms the API Gateway event into the format
 * expected by the growth strategy use case
 */
const growthStrategyEventParser: EventParser<RequestGrowthStrategyInput> = (
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
    keyId: validUser.keyId,
    orderId,
    deliverableId,
    applicationIdea: eventBody.applicationIdea,
    idealCustomer: eventBody.idealCustomer,
    deliverableName: eventBody.deliverableName || '',
    agentId: eventBody.agentId || ''
  };
};

/**
 * Configuration options for the growth strategy adapter
 */
const growthStrategyAdapterOptions: LambdaAdapterOptions = {
  requireAuth: true,
  requireBody: true,
  requiredFields: ['applicationIdea', 'idealCustomer']
};

/**
 * Use case for publishing a growth strategy request
 */
const publishGrowthStrategyUseCase = createOrderProcessor({
  createOrder: (request: RequestGrowthStrategyInput): GrowthStrategyOrder => ({
    topic: Topic.orders,
    queue: Queue.growthStrategy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    payload: {
      orderId: request.orderId,
      keyId: request.keyId,
      userId: request.userId,
      deliverableId: request.deliverableId,
      agentId: request.agentId,
      deliverableName: request.deliverableName,
      applicationIdea: request.applicationIdea,
      idealCustomer: request.idealCustomer
    }
  }),
  orderManagerAdapter,
  creditsAdapter: updateCreditsAdapter,
  agentCost: AgentCost.GrowthStrategy,
  errorMessage: 'Failed to publish growth strategy task'
});

/**
 * Lambda adapter for handling growth strategy requests
 * 
 * This adapter:
 * 1. Authenticates the user
 * 2. Validates the request body
 * 3. Parses and validates the input using the schema
 * 4. Executes the growth strategy use case
 * 5. Formats and returns the response
 */
export const requestGrowthStrategyAdapter = createLambdaAdapter({
  schema: RequestGrowthStrategyInputSchema,
  useCase: publishGrowthStrategyUseCase,
  eventParser: growthStrategyEventParser,
  options: growthStrategyAdapterOptions,
  responseFormatter: (result) => OrchestratorHttpResponses.GrowthStrategyRequestReceived({ body: result })
});
