// Lambda Handlers attached to the queues as entry points to services
import { createSQSHandler, createDynamoDBStreamHandler } from "@utils/tools/custom-handler";
import { createContentAdapter } from "@agent-runtime/content-generator/adapters/primary/generate-content"

export const contentGeneratorHandler = createSQSHandler(createContentAdapter);
