import { 
    researchTable, usersTable, transactionsTable, apiKeysTable
} from "./database";

import { 
  secrets, stripeSecretKey, stripeWebhookSecret
 } from "./secrets";
import { 
  TaskTopic, researchQueue 
} from "./orchestrator";

import * as sst from "sst";

export const api = new sst.aws.ApiGatewayV2('BackendApi')


const topics = [TaskTopic]
const tables = [researchTable, usersTable, transactionsTable, apiKeysTable]
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
  environment: {
    STRIPE_SECRET_KEY: stripeSecretKey.value,
    REDIRECT_SUCCESS_URL: "http://localhost:3000/dashboard",
    REDIRECT_FAILURE_URL: "http://localhost:3000/dashboard"
  }
})

api.route("POST /webhook", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.webhookHandler",
  environment: {
    STRIPE_SECRET_KEY: stripeSecretKey.value,
    STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value
  }
})

api.route("POST /api-keys", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.createApiKeyHandler"
})

api.route("GET /credits", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.getUserCreditsHandler"
})



