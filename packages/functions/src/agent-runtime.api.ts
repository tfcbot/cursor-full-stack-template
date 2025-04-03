// Lambda Handlers attached to the queues as entry points to services
import { createHandler, createSQSHandler } from "@utils/tools/custom-handler";
import { requestResearchAdapter } from "@agent-runtime/researcher/adapters/primary/request-research.adapter";
import { getResearchAdapter } from "@agent-runtime/researcher/adapters/primary/get-research.adapter";
import { generateResearchReportAdapter } from "@agent-runtime/researcher/adapters/primary/generate-research-report.adapter";

export const requestResearchHandler = createHandler(requestResearchAdapter);
export const getResearchHandler = createHandler(getResearchAdapter);
export const generateResearchReportHandler = createSQSHandler(generateResearchReportAdapter);
