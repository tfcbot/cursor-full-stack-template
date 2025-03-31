# Full-Stack Architecture Concepts

## Overview
This is a modern full-stack application built with Next.js, SST (Serverless Stack), and AWS services. The architecture follows a event-driven, serverless approach with clear separation of concerns.

## Directory Structure

```
.
├── infra/           # Infrastructure as code (SST configurations)
└── packages/
    ├── core/        # Core business logic and domain models
    ├── frontend/    # Next.js web application
    ├── functions/   # Lambda functions
    ├── metadata/    # Shared types and schemas
    └── utils/       # Shared utilities
```

## Key Components

### Infrastructure (infra/)
- **api.ts**: Defines API Gateway routes and connects them to Lambda functions
- **topic.ts**: Configures SNS topics for event-driven communication
- **queues.ts**: Sets up SQS queues for asynchronous processing
- **database.ts**: Defines DynamoDB tables
- **secrets.ts**: Manages application secrets and environment variables

### Packages

#### Core (packages/core)
- Contains business logic and domain models
- Implements use cases and business rules
- Provides adapters for external services

#### Frontend (packages/frontend)
- Next.js application with App Router
- Server Components and Server Actions
- Direct integration with AWS services through SST
- Client-side state management with React Query

#### Functions (packages/functions)
- Lambda function handlers
- API endpoints implementation
- Event processors for queues
- Integration between API Gateway and core business logic

#### Metadata (packages/metadata)
- Shared type definitions
- Schema validations
- Common interfaces used across packages

#### Utils (packages/utils)
- Shared utilities and helpers
- Common functionality used across packages

## Data Flow

1. **API Requests**
   - Client makes request to Next.js frontend
   - Server Actions or API routes handle the request
   - Direct interaction with AWS services through SST bindings

2. **Event Processing**
   - Events published to SNS topics
   - SQS queues subscribe to relevant topics
   - Lambda functions process queue messages
   - Core business logic handles the processing

3. **Data Storage**
   - DynamoDB tables store application data
   - Core package handles data access patterns
   - Consistent schema validation through metadata package

## Key Features

### Event-Driven Architecture
- SNS topics for pub/sub messaging
- SQS queues for reliable message processing
- Decoupled components through event-based communication

### Type Safety
- Shared types through metadata package
- Consistent schema validation
- TypeScript throughout the stack

### Infrastructure as Code
- SST for AWS resource definition
- Clear resource relationships
- Automated deployments

### Serverless First
- Lambda functions for compute
- API Gateway for HTTP endpoints
- DynamoDB for storage
- Pay-per-use infrastructure

## Development Workflow

1. **Local Development**
   - SST provides local development environment
   - Live Lambda development
   - Local AWS service emulation

2. **Deployment**
   - SST handles infrastructure deployment
   - Automatic environment binding
   - Stage-based deployments (dev, staging, prod)

## Best Practices

1. **Separation of Concerns**
   - Clear package boundaries
   - Shared types and utilities
   - Domain-driven design principles

2. **Type Safety**
   - Consistent type definitions
   - Schema validation
   - Compile-time checks

3. **Security**
   - Proper IAM roles and permissions
   - Secret management
   - Secure API access

4. **Scalability**
   - Event-driven architecture
   - Serverless infrastructure
   - Asynchronous processing

## Common Patterns

1. **Publisher/Subscriber**
   - SNS topics for event publishing
   - SQS queues for event processing
   - Decoupled communication

2. **API Gateway Pattern**
   - HTTP endpoints through API Gateway
   - Lambda integration
   - Request/response handling

3. **Repository Pattern**
   - Data access through repositories
   - Consistent database interactions
   - Separation from business logic 