// Lambda Handlers attached to the queues as entry points to services
import { createSQSHandler,createHandler,  createDynamoDBStreamHandler } from "@utils/tools/custom-handler";
import { createContentAdapter } from "@agent-runtime/content-generator/adapters/primary/generate-content"
import { requestContentAdapter } from "@agent-runtime/content-generator/adapters/primary/request-content.adapter"

export const contentGeneratorHandler = createSQSHandler(createContentAdapter);
export const requestContentHandler = createHandler(requestContentAdapter);