import { createSqsAdapter } from "@lib/sqs-adapter.factory";
import { RequestDeepResearchInputSchema } from "@metadata/agents/deep-research-agent.schema";
import { runDeepResearchUsecase } from "@agent-runtime/deep-researcher/usecase/deep-research.usecase";

/**
 * Research Report Generator SQS Adapter
 * 
 * This module provides an adapter for processing SQS events related to research report generation.
 * It leverages the SQS adapter factory for standardized handling of SQS events, including:
 * - Message parsing and validation
 * - Error handling
 * - Parallel processing of messages
 */

export const createResearchReportAdapter = createSqsAdapter({
  schema: RequestDeepResearchInputSchema,
  useCase: runDeepResearchUsecase,
  adapterName: 'RESEARCH-REPORT-GENERATOR',
  options: {
    verboseLogging: true,
    processInParallel: true,
    continueOnError: false
  }
});