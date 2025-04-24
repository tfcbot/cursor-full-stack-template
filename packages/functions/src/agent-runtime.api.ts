import { createHandler } from "@utils/tools/custom-handler";
import { requestTaskAdapter } from "@agent-runtime/agent/adapters/primary/request-task.adapter";
import { getTaskByIdAdapter } from "@agent-runtime/agent/adapters/primary/get-task-by-id.adapter";
import { getAllUserTasksAdapter } from "@agent-runtime/agent/adapters/primary/get-all-tasks.adapter";

export const requestTaskHandler = createHandler(requestTaskAdapter);
export const getAllUserTasksHandler = createHandler(getAllUserTasksAdapter);
export const getTaskByIdHandler = createHandler(getTaskByIdAdapter);
