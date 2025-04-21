# How-To Guide for Cursor Full-Stack Template

This guide provides step-by-step instructions for common tasks related to infrastructure updates, frontend development, and deployment workflows.

## Getting Started

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/cursor-full-stack-template.git
   cd cursor-full-stack-template
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration.

## Infrastructure Updates

### Adding a New API Endpoint

1. **Define the Lambda function**:
   Create a new file in `packages/functions/src`:
   ```typescript
   // packages/functions/src/api/myNewEndpoint.ts
   import { ApiHandler } from "aws-lambda";
   import { handleError } from "@utils/tools/custom-error";
   
   export const handler: ApiHandler = async (event) => {
     try {
       // Implement your business logic here
       return {
         statusCode: 200,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ message: "Success" })
       };
     } catch (error) {
       console.error('Error processing request:', error);
       return handleError(error);
     }
   };
   ```

2. **Add the route to infrastructure**:
   Update `infra/api.ts`:
   ```typescript
   // Add to existing routes
   api.route("GET /my-new-endpoint", {
     link: [...apiResources],
     handler: "./packages/functions/src/api/myNewEndpoint.handler",
   })
   ```

3. **Deploy the changes**:
   ```bash
   yarn sst deploy
   ```

### Creating a New Database Table

1. **Define the table in infrastructure**:
   Update `infra/database.ts`:
   ```typescript
   export const myNewTable = new sst.aws.Table("MyNewTable", {
     fields: {
       id: "string",
       createdAt: "string",
       data: "string",
     },
     primaryIndex: { partitionKey: "id" },
   })
   ```

2. **Create a repository for the table**:
   ```typescript
   // packages/core/src/repositories/myNew.repository.ts
   import { createDynamoDBRepository } from "@lib/dynamodb-repository.factory";
   import { MyNewEntitySchema } from "@metadata/schemas/myNew.schema";

   export const myNewRepository = createDynamoDBRepository({
     tableName: "MyNewTable",
     schema: MyNewEntitySchema,
     partitionKey: "id",
   });
   ```

3. **Link the table to existing resources**:
   Update any relevant files that need access to the table, e.g., `infra/api.ts`:
   ```typescript
   const apiResources = [
     ...topics,
     ...tables,
     myNewTable, // Add the new table
     ...secrets,
   ]
   ```

### Adding a New SNS Topic and SQS Queue

1. **Create the SNS topic**:
   Update `infra/topic.ts`:
   ```typescript
   export const MyNewTopic = new sst.aws.SnsTopic("MyNewTopic")
   ```

2. **Create a topic publisher method**:
   Update or extend `packages/core/src/lib/topic-publisher.adapter.ts`:
   ```typescript
   // Add to the TopicPublisher class
   async publishToMyNewTopic(message: any): Promise<void> {
     const topicArn = this.topicArns[Topic.myNew];
     console.log("--- Publishing to MyNewTopic ---");
     try {
       await this.snsClient.send(new PublishCommand({
         TopicArn: topicArn,
         Message: JSON.stringify(message),
         MessageAttributes: {
           queue: {
             DataType: 'String',
             StringValue: 'myNewQueue'
           }
         }
       }));
       console.log("--- Message published to MyNewTopic ---");
     } catch (error) {
       console.error('Error publishing to topic:', error);
       throw new Error('Failed to publish to topic');
     }
   }
   ```

3. **Create the SQS queue**:
   Update `infra/queues.ts`:
   ```typescript
   export const myNewQueue = new sst.aws.Queue("MyNewQueue")
   
   myNewQueue.subscribe({
     handler: "./packages/functions/src/handlers/myNewHandler.ts",
     link: [
       myNewTable,
       ...secrets,
     ],
   })
   ```

4. **Create an SQS handler with the adapter factory**:
   ```typescript
   // packages/functions/src/handlers/myNewHandler.ts
   import { createSqsAdapter } from "@lib/sqs-adapter.factory";
   import { MyNewMessageSchema } from "@metadata/schemas/myNew.schema";
   
   const processMyNewMessage = async (data: MyNewMessage) => {
     // Implement your business logic here
     console.log("Processing message:", data);
     return { success: true };
   };
   
   export const handler = createSqsAdapter({
     schema: MyNewMessageSchema,
     useCase: processMyNewMessage,
     adapterName: "MY-NEW-HANDLER",
     options: {
       verboseLogging: true
     }
   });
   ```

5. **Subscribe the queue to the topic**:
   Update `infra/topic.ts`:
   ```typescript
   MyNewTopic.subscribeQueue(
     "myNewSubscription",
     myNewQueue.arn,
     {
       filter: {
         "queue": ["myNewQueue"]
       }
     }
   )
   ```

## Frontend Development

### Adding a New Page

1. **Create the page component**:
   ```typescript
   // packages/frontend/app/my-new-page/page.tsx
   export default function MyNewPage() {
     return (
       <div className="container mx-auto py-8">
         <h1 className="text-2xl font-bold">My New Page</h1>
         <p>This is my new page content.</p>
       </div>
     );
   }
   ```

2. **Add navigation to the page**:
   Update your navigation component to include a link to the new page.

3. **Create API hooks for the page**:
   If your page needs to fetch data, add a new hook in `packages/frontend/app/api.ts`:
   ```typescript
   export function useMyNewData() {
     const { getToken } = useAuth();
     
     return useQuery({
       queryKey: ['myNewData'],
       queryFn: async () => {
         const token = await getToken();
         const response = await fetch(`${API_URL}/my-new-endpoint`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
         if (!response.ok) {
           throw new Error('Network response was not ok');
         }
         return response.json();
       },
     });
   }
   ```

### Creating a Server Action for Direct AWS Interaction

1. **Create a server action file**:
   ```typescript
   // packages/frontend/app/actions/myAction.ts
   "use server";
   
   import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
   import { Resource } from "sst";
   import { Topic } from "@metadata/orchestrator.schema";
   
   export async function publishToMyTopic(data: any) {
     const snsClient = new SNSClient({});
     
     try {
       const result = await snsClient.send(new PublishCommand({
         TopicArn: Resource.MyNewTopic.arn,
         Message: JSON.stringify(data),
         MessageAttributes: {
           queue: {
             DataType: 'String',
             StringValue: 'myNewQueue'
           }
         }
       }));
       
       return { success: true, messageId: result.MessageId };
     } catch (error) {
       console.error('Error publishing to SNS:', error);
       return { success: false, error: error.message };
     }
   }
   ```

2. **Use the server action in a component**:
   ```typescript
   // packages/frontend/app/components/MyForm.tsx
   "use client";
   
   import { publishToMyTopic } from "../actions/myAction";
   import { useState } from "react";
   
   export default function MyForm() {
     const [message, setMessage] = useState("");
     const [status, setStatus] = useState<null | { success: boolean; messageId?: string }>(null);
     
     async function handleSubmit(e: React.FormEvent) {
       e.preventDefault();
       const result = await publishToMyTopic({ message });
       setStatus(result);
     }
     
     return (
       <form onSubmit={handleSubmit}>
         <input
           type="text"
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           className="border p-2 rounded"
         />
         <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
           Send
         </button>
         {status && (
           <div className={status.success ? "text-green-500" : "text-red-500"}>
             {status.success ? `Message sent: ${status.messageId}` : "Error sending message"}
           </div>
         )}
       </form>
     );
   }
   ```

## Deployment Workflow

### Development Deployment

To deploy to the development environment:

```bash
yarn sst deploy --stage dev
```

### Production Deployment

To deploy to production (with additional safeguards):

```bash
yarn sst deploy --stage production
```

### Testing Infrastructure Changes Locally

1. **Start the local SST development environment**:
   ```bash
   yarn sst dev
   ```

2. **Start the Next.js development server**:
   ```bash
   cd packages/frontend
   yarn dev
   ```

3. **Test your infrastructure by making API calls or publishing to topics**:
   - The SST dev environment will automatically bind your local frontend to the local infrastructure
   - Changes to infrastructure code in `infra/` will be automatically applied
   - Changes to Lambda functions will be automatically reloaded

### Rollback Procedure

If a deployment causes issues, you can roll back to a previous version:

```bash
yarn sst rollback --stage <stage-name>
```

## Working with Metadata Package

### Adding a New Schema

1. **Create the schema file**:
   ```typescript
   // packages/metadata/src/schemas/myNewSchema.ts
   import { z } from "zod";
   
   export const MyNewEntitySchema = z.object({
     id: z.string(),
     name: z.string(),
     createdAt: z.string(),
     data: z.record(z.any()).optional(),
   });
   
   export type MyNewEntity = z.infer<typeof MyNewEntitySchema>;
   ```

2. **Export the schema from the package**:
   Update `packages/metadata/src/index.ts`:
   ```typescript
   export * from "./schemas/myNewSchema";
   ```

3. **Use the schema in other packages**:
   ```typescript
   import { MyNewEntitySchema, MyNewEntity } from "@metadata/schemas/myNewSchema";
   
   // Use in validation
   const validatedData = MyNewEntitySchema.parse(inputData);
   ```

## Troubleshooting

### Common Deployment Issues

- **Missing IAM permissions**: Check the CloudFormation logs for permission errors
- **Lambda execution errors**: View CloudWatch logs for the specific Lambda function
- **API Gateway issues**: Check the API Gateway configuration and routes

### Local Development Issues

- **SST connection issues**: Ensure `yarn sst dev` is running
- **Next.js binding issues**: Check if `.env.local` is properly populated
- **DynamoDB local issues**: Restart the SST dev environment

### Package Dependencies

If you encounter dependency issues:

1. **Clear node_modules**:
   ```bash
   rm -rf node_modules
   rm -rf packages/*/node_modules
   ```

2. **Reinstall dependencies**:
   ```bash
   yarn install
   ```

## Best Practices

- Always add proper typing to new schemas in the metadata package
- Use server actions for direct AWS interactions from the frontend
- Follow the event-driven pattern for asynchronous operations
- Document new infrastructure components in the README or related documentation
- Use feature branches and pull requests for infrastructure changes
- Leverage the adapter factory patterns in `@lib` for consistent handling of AWS services

Update or extend `packages/core/src/lib/event-emitter.adapter.ts`:

// ... existing content ...
