import { 
    researchTable, usersTable, apiKeysTable
} from "./database";

import { 
  secrets, stripeSecretKey, stripeWebhookSecret, unkeyApiId, unkeyRootKey
 } from "./secrets";
import { 
  TaskTopic, researchQueue 
} from "./orchestrator";


export const api = new sst.aws.ApiGatewayV2('BackendApi')


const topics = [TaskTopic]
const tables = [researchTable, usersTable, apiKeysTable]
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
    REDIRECT_FAILURE_URL: "http://localhost:3000/dashboard",
    UNKEY_API_ID: unkeyApiId.value,
    UNKEY_ROOT_KEY: unkeyRootKey.value
  }
})

api.route("POST /webhook", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.webhookHandler",
  environment: {
    STRIPE_SECRET_KEY: stripeSecretKey.value,
    STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
    UNKEY_API_ID: unkeyApiId.value,
    UNKEY_ROOT_KEY: unkeyRootKey.value
  }
})

api.route("POST /api-keys", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.createApiKeyHandler",
  environment: {
    UNKEY_API_ID: unkeyApiId.value,
    UNKEY_ROOT_KEY: unkeyRootKey.value
  }
})

api.route("GET /credits", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.getUserCreditsHandler",
  environment: {
    UNKEY_API_ID: unkeyApiId.value,
    UNKEY_ROOT_KEY: unkeyRootKey.value
  }
})

api.route("POST /clerk-webhook", {
  link: [...apiResources],
  handler: "./packages/functions/src/clerk-webhook.handler",
})



