import { createHandler } from "@utils/tools/custom-handler";
import { requestAgentTaskAdapter } from "@agent-runtime/researcher/adapters/primary/request-research.adapter";
import { getAgentTaskByIdAdapter } from "@agent-runtime/researcher/adapters/primary/get-research-by-id.adapter";
import { getAllUserTasksAdapter } from "@agent-runtime/researcher/adapters/primary/get-all-research.adapter";

// Agent task endpoints
export const requestAgentTaskHandler = createHandler(requestAgentTaskAdapter);
export const getAllUserTasksHandler = createHandler(getAllUserTasksAdapter);
export const getAgentTaskByIdHandler = createHandler(getAgentTaskByIdAdapter);

// For backward compatibility
export const requestResearchHandler = requestAgentTaskHandler;
export const getAllUserResearchHandler = getAllUserTasksHandler;
export const getResearchByIdHandler = getAgentTaskByIdHandler;
