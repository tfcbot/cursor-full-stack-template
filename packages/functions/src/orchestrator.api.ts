// Responsible for handling entry point API Gateway events and sending them to the appropriate queue
import { createDynamoDBStreamHandler, createHandler } from "@utils/tools/custom-handler"

