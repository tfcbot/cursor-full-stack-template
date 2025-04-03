import { createSqsAdapter } from "@lib/sqs-adapter.factory";
import { RequestResearchInputSchema } from "@metadata/agents/research-agent.schema";
import { runResearchUsecase } from "@agent-runtime/researcher/usecase/research.usecase";

/**
 * Research Report Generator SQS Adapter
 * 
 * This module provides an adapter for processing SQS events related to research report generation.
 * It leverages the SQS adapter factory for standardized handling of SQS events, including:
 * - Message parsing and validation
 * - Error handling
 * - Parallel processing of messages
 */

export const generateResearchReportAdapter = createSqsAdapter({
  schema: RequestResearchInputSchema,
  useCase: runResearchUsecase,
  adapterName: 'RESEARCH-REPORT-GENERATOR',
  options: {
    verboseLogging: true,
    processInParallel: true,
    continueOnError: false
  }
});