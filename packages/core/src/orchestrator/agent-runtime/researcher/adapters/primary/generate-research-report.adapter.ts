import { createEventBridgeAdapter } from "@lib/eventbridge-adapter.factory";
import { RequestResearchInputSchema } from "@metadata/agents/research-agent.schema";
import { runResearchUsecase } from "@agent-runtime/researcher/usecase/research.usecase";

/**
 * Research Report Generator EventBridge Adapter
 * 
 * This module provides an adapter for processing EventBridge events related to research report generation.
 * It leverages the EventBridge adapter factory for standardized handling of events, including:
 * - Event parsing and validation
 * - Error handling
 * - Processing of events
 */

export const generateResearchReportAdapter = createEventBridgeAdapter({
  schema: RequestResearchInputSchema,
  useCase: runResearchUsecase,
  adapterName: 'RESEARCH-REPORT-GENERATOR',
  options: {
    verboseLogging: true,
    continueOnError: false
  }
});
