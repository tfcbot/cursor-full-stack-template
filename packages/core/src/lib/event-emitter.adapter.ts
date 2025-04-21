import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge"
import { Topic } from "@metadata/orchestrator.schema"
import { AgentMessage } from "@metadata/task.schema";

import { Resource } from "sst";

export class EventEmitter {
  private ebClient: EventBridgeClient;

  constructor() {
    this.ebClient = new EventBridgeClient({});
  }

  async publishAgentMessage(message: AgentMessage): Promise<void> {
    console.log("--- Publishing agent message to EventBridge ---");
    try {
      await this.ebClient.send(new PutEventsCommand({
        Entries: [
          {
            EventBusName: Resource.TaskBus.name,
            Source: "task",
            DetailType: message.queue,
            Detail: JSON.stringify({
              ...message.payload,
              queue: message.queue
            })
          }
        ]
      }));
      console.log("--- Agent message published to EventBridge ---");
    } catch (error) {
      console.error('Error publishing to EventBridge:', error);
      throw new Error('Failed to publish to EventBridge');
    }
  }
}

export const eventEmitter = new EventEmitter();
