import { 
    contentTable
 } from "./database";
import { 
  secrets,
 } from "./secrets";
import { AgentTopic } from "./topic";


export const api = new sst.aws.ApiGatewayV2('BackendApi')


const topics = [AgentTopic]
const tables = [contentTable]


const apiResources = [
  ...topics,
  ...tables,
  ...secrets,
]


api.route("GET /content", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.contentHandler",
})


api.route("POST /content", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.contentHandler",
})



