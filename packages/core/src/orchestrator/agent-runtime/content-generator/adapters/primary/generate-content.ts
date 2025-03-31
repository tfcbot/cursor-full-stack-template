/**
 * Content Generator SQS Adapter
 * 
 * This module provides an adapter for processing SQS events related to content generation.
 * It leverages the SQS adapter factory for standardized handling of SQS events, including:
 * - Message parsing and validation
 * - Error handling
 * - Parallel processing of messages
 */
import { createSqsAdapter } from '@lib/sqs-adapter.factory';
import { RequestContentInputSchema } from '@metadata/agents/content-agent.schema';
import { createContentUsecase } from '@agent-runtime/content-generator/usecases/generate-content.usecase';

export const createContentAdapter = createSqsAdapter({
  schema: RequestContentInputSchema,
  useCase: createContentUsecase,
  adapterName: 'CONTENT-GENERATOR',
  options: {
    verboseLogging: true,
    processInParallel: true,
    continueOnError: false
  }
});
