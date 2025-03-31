// Lambda Handlers attached to the queues as entry points to services
import { createHandler, createSQSHandler } from "@utils/tools/custom-handler";
import { requestDeepResearchAdapter } from "@agent-runtime/deep-researcher/adapters/primary/request-deep-research.adapter";
import { getResearchAdapter } from "@agent-runtime/deep-researcher/adapters/primary/get-research.adapter";

export const requestDeepResearchHandler = createHandler(requestDeepResearchAdapter);
export const getResearchHandler = createHandler(getResearchAdapter);
export const deepResearchSQSHandler = createSQSHandler(requestDeepResearchAdapter);
