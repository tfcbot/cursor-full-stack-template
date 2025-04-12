const openaiApiKey = new sst.Secret("OpenAiApiKey")
const clerkClientPublishableKey = new sst.Secret("ClerkClientPublishableKey")
const clerkClientSecretKey = new sst.Secret("ClerkClientSecretKey")
const clerkWebhookSecret = new sst.Secret("ClerkWebhookSecret")

export const secrets = [
    openaiApiKey,
    clerkClientPublishableKey,
    clerkClientSecretKey,
    clerkWebhookSecret
]

export const ClerkClientPublishableKey = clerkClientPublishableKey
export const ClerkClientSecretKey = clerkClientSecretKey
export const ClerkWebhookSecret = clerkWebhookSecret
