// Lambda Handlers attached to the queues as entry points to services
import { createHandler, createSQSHandler } from "@utils/tools/custom-handler";
import { requestResearchAdapter } from "@agent-runtime/researcher/adapters/primary/request-research.adapter";
import { getAllResearchAdapter } from "@agent-runtime/researcher/adapters/primary/get-all-research.adapter";
import { getResearchByIdAdapter } from "@agent-runtime/researcher/adapters/primary/get-research-by-id.adapter";
import { generateResearchReportAdapter } from "@agent-runtime/researcher/adapters/primary/generate-research-report.adapter";

export const requestResearchHandler = createHandler(requestResearchAdapter);
export const getAllResearchHandler = createHandler(getAllResearchAdapter);
export const getResearchByIdHandler = createHandler(getResearchByIdAdapter);
export const generateResearchReportHandler = createSQSHandler(generateResearchReportAdapter);
