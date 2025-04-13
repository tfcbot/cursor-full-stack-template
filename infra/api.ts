import { 
    researchTable, usersTable, userKeysTable
} from "./database";

import { 
  secrets
} from "./secrets";
import { 
  TaskTopic, researchQueue 
} from "./orchestrator";


export const api = new sst.aws.ApiGatewayV2('BackendApi')


const topics = [TaskTopic]
const tables = [researchTable, usersTable, userKeysTable]
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

// Add a route for getting a specific research item by ID
api.route("GET /research/{id}", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.getResearchHandler",
})

api.route("POST /research", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.requestResearchHandler",
})

api.route("POST /checkout", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.checkoutHandler",
 
})

api.route("POST /webhook", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.webhookHandler",
 
})

api.route("POST /api-keys", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.createApiKeyHandler",
 
})

api.route("GET /credits", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.getUserCreditsHandler",
})

api.route("POST /register", { 
  link: [...apiResources],
  handler: "./packages/functions/src/auth.api.registerWebhookHandler",
  permissions: [
    {
        actions: ["dynamodb:*", "dynamodb:PutItem"],
        resources: [usersTable.arn]
    }
],
})

