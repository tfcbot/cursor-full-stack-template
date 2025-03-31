import { 
    researchTable
 } from "./database";
import { 
  secrets,
 } from "./secrets";
import { AgentTopic } from "./topic";


export const api = new sst.aws.ApiGatewayV2('BackendApi')


const topics = [AgentTopic]
const tables = [researchTable]


export const apiResources = [
  ...topics,
  ...tables,
  ...secrets,
]


api.route("GET /deep-research", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.getResearchHandler",
})


api.route("POST /deep-research", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.requestDeepResearchHandler",
})



