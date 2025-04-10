# AWS/SST Backend Integration Guide

This guide explains how to integrate the backend with AWS using the Serverless Stack (SST) framework in this template.

## Overview

The template uses a serverless architecture powered by AWS services and orchestrated by SST. The main components are:

- **API Gateway**: Exposes REST endpoints for client interactions
- **Lambda Functions**: Executes business logic, processes requests, and generates responses
- **DynamoDB**: Stores data in a flexible, scalable NoSQL database
- **SNS/SQS**: Handles asynchronous messaging and event-driven architecture
- **S3**: Stores static assets and files (if needed)

## Current Architecture

The application follows a clean architecture pattern:

1. **API Layer** (API Gateway + Lambda)
   - Handles HTTP requests and responses
   - Validates input data
   - Routes to appropriate business logic

2. **Core Business Logic**
   - Domain models and business rules
   - Use cases for research generation

3. **Data Layer**
   - DynamoDB for persistence
   - Repositories for data access abstraction

4. **Messaging Layer**
   - SNS for publishing events
   - SQS for processing events asynchronously

## Infrastructure as Code

All infrastructure is defined as code in the `infra/` directory:

- `api.ts`: API Gateway configuration
- `database.ts`: DynamoDB table definitions
- `orchestrator.ts`: SNS/SQS setup
- `frontend.ts`: Next.js frontend configuration
- `secrets.ts`: Secret management

## Integrating Artifacts Feature

To integrate the artifacts feature with the backend, follow these steps:

### 1. Update DynamoDB Schema

Add an artifacts table to store artifact data:

```typescript
// infra/database.ts
export const artifactsTable = new sst.aws.Dynamo("Artifacts", {
  fields: {
    artifactId: "string",
    researchId: "string",
    kind: "string"
  },
  primaryIndex: { hashKey: "artifactId" },
  globalIndexes: {
    researchIndex: {
      hashKey: "researchId",
      projection: "all"
    }
  }
});
```

### 2. Create API Endpoints

Add new endpoints to handle artifact operations:

```typescript
// infra/api.ts
api.route("GET /artifacts/{id}", {
  link: [...apiResources, artifactsTable],
  handler: "./packages/functions/src/artifacts.api.getArtifactHandler",
});

api.route("GET /research/{id}/artifacts", {
  link: [...apiResources, artifactsTable],
  handler: "./packages/functions/src/artifacts.api.getArtifactsByResearchHandler",
});

api.route("POST /artifacts", {
  link: [...apiResources, artifactsTable],
  handler: "./packages/functions/src/artifacts.api.createArtifactHandler",
});
```

### 3. Update Message Flow

Extend the messaging system to handle artifact generation:

```typescript
// infra/orchestrator.ts
export const artifactsQueue = new sst.aws.Queue("ArtifactsQueue")

TaskTopic.subscribeQueue(
  "ArtifactsQueue", 
  artifactsQueue.arn, 
  {
    filter: {
      "queue": ["artifacts"]
    }
  }
)

artifactsQueue.subscribe({
  handler: "./packages/functions/src/artifacts.api.generateArtifactHandler", 
  link: [
    artifactsTable, 
    researchTable,
    ...secrets,
    TaskTopic
  ], 
  permissions: [
    {
      actions: [
        "dynamodb:PutItem", 
        "dynamodb:GetItem", 
        "dynamodb:Query",
        "sqs:DeleteMessage"
      ], 
      resources: [
        researchTable.arn,
        artifactsTable.arn,
        artifactsQueue.arn
      ]
    }, 
  ],
})
```

### 4. Create Schema Definitions

Define schemas for artifact data:

```typescript
// packages/metadata/agents/artifact.schema.ts
import { z } from "zod";
import { randomUUID } from "crypto";

export const CreateArtifactInputSchema = z.object({
  researchId: z.string(),
  kind: z.enum(["text", "code"]),
  title: z.string(),
  content: z.string(),
  id: z.string().default(randomUUID()),
});

export const ArtifactOutputSchema = z.object({
  artifactId: z.string(),
  researchId: z.string(),
  kind: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateArtifactInput = z.infer<typeof CreateArtifactInputSchema>;
export type ArtifactOutput = z.infer<typeof ArtifactOutputSchema>;
```

### 5. Implement Lambda Functions

Create the Lambda function handlers for artifact operations:

```typescript
// packages/functions/src/artifacts.api.ts
import { ResearchRepository } from "@core/orchestrator/agent-runtime/researcher/adapters/secondary/research.repository";
import { createLambdaAdapter } from "@core/lib/lambda-adapter.factory";
import { ArtifactOutput, CreateArtifactInput } from "@metadata/agents/artifact.schema";

// Get a single artifact by ID
export const getArtifactHandler = createLambdaAdapter<ArtifactOutput>({
  handler: async (event) => {
    const artifactId = event.pathParameters?.id;
    
    if (!artifactId) {
      throw new Error("Artifact ID is required");
    }
    
    // Implement repository and retrieval logic
    return {
      /* artifact data */
    };
  }
});

// Get all artifacts for a research ID
export const getArtifactsByResearchHandler = createLambdaAdapter<ArtifactOutput[]>({
  handler: async (event) => {
    const researchId = event.pathParameters?.id;
    
    if (!researchId) {
      throw new Error("Research ID is required");
    }
    
    // Implement repository and retrieval logic
    return [
      /* artifact data */
    ];
  }
});

// Create a new artifact
export const createArtifactHandler = createLambdaAdapter<ArtifactOutput, CreateArtifactInput>({
  handler: async (event, input) => {
    // Implement creation logic
    return {
      /* created artifact data */
    };
  }
});
```

## Deployment

To deploy your changes:

1. Install dependencies:
   ```bash
   bun install
   ```

2. Deploy to AWS:
   ```bash
   bun sst deploy
   ```

3. For development purposes, you can run the SST dev environment:
   ```bash
   bun sst dev
   ```

## Testing

To test your AWS infrastructure:

1. Use the AWS Console to verify created resources
2. Use CloudWatch Logs to debug Lambda function execution
3. Create unit tests for your Lambda functions

## Monitoring

Set up monitoring for your serverless infrastructure:

1. Use CloudWatch metrics to monitor API Gateway, Lambda, and DynamoDB
2. Set up alarms for error rates, duration, and throttling
3. Use X-Ray for tracing requests through services
