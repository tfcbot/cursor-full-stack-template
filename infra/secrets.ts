
export const openaiApiKey = new sst.Secret("OpenAiApiKey")
export const stripeSecretKey = new sst.Secret('StripeSecretKey')
export const stripeWebhookSecret = new sst.Secret('StripeWebhookSecret')
export const stripePublishableKey = new sst.Secret('StripePublishableKey')
export const unkeyApiId = new sst.Secret('UnkeyApiId')
export const unkeyRootKey = new sst.Secret('UnkeyRootKey')

export const secrets = [openaiApiKey, stripeSecretKey, stripeWebhookSecret, stripePublishableKey, unkeyApiId, unkeyRootKey]
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
