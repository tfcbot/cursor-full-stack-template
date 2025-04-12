# Clerk Authentication Setup

This document provides instructions for setting up Clerk authentication in the cursor-full-stack-template project.

## Prerequisites

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Configure your application settings in the Clerk dashboard

## Environment Variables

The following environment variables need to be set in your SST deployment:

```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## Setting Up Secrets in SST

The application uses SST secrets to manage Clerk credentials. These secrets need to be configured before deployment:

```bash
# Set the Clerk publishable key
npx sst secrets set ClerkClientPublishableKey pk_test_...

# Set the Clerk secret key
npx sst secrets set ClerkClientSecretKey sk_test_...

# Set the Clerk webhook secret
npx sst secrets set ClerkWebhookSecret whsec_...
```

## Frontend Configuration

The frontend uses the `@clerk/nextjs` package to handle authentication. The ClerkProvider is configured in the root layout component, and the middleware is set up to protect routes.

### Public Routes

By default, only the home page (`/`) is configured as a public route. You can modify the public routes in the `middleware.ts` file:

```typescript
// packages/frontend/src/middleware.ts
export default authMiddleware({
  publicRoutes: ["/", "/about", "/login"],
});
```

## Backend Configuration

The backend uses the `@clerk/backend` package to validate JWT tokens from Clerk. The `SaaSIdentityVendingMachine` class handles authentication and user validation.

### Webhook Handling

A webhook handler is configured to process Clerk events (user creation, deletion, etc.). You need to configure the webhook URL in the Clerk dashboard to point to your API endpoint:

```
https://your-api-url/clerk-webhook
```

## Testing Authentication

To test that authentication is working correctly:

1. Start the development server: `bun run dev`
2. Navigate to a protected route
3. You should be redirected to the Clerk sign-in page
4. After signing in, you should be redirected back to the protected route

## Troubleshooting

If you encounter issues with authentication:

1. Check that all environment variables are set correctly
2. Verify that the Clerk webhook is configured properly
3. Check the browser console and server logs for error messages
