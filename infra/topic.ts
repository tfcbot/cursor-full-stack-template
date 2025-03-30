import { contentQueue } from "./queues"


// Topics
export const AgentTopic = new sst.aws.SnsTopic("AgentTopic")

AgentTopic.subscribeQueue(
  "content", 
  contentQueue.arn, 
  {
      filter: {
          "queue": ["content"]
      }
  }
)
