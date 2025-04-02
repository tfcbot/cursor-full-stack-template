import { 
    researchTable
 } from "./database";

import { 
  secrets,
 } from "./secrets";
import { TaskTopic, researchQueue } from "./orchestrator";


export const api = new sst.aws.ApiGatewayV2('BackendApi')


const topics = [TaskTopic]
const tables = [researchTable]
const queues = [researchQueue]

export const apiResources = [
  ...topics,
  ...tables,
  ...secrets,
  ...queues
]


api.route("GET /research", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.getResearchHandler",
})


api.route("POST /research", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.requestResearchHandler",
})



