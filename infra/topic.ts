import { researchQueue } from "./queues"


// Topics
export const AgentTopic = new sst.aws.SnsTopic("AgentTopic")

AgentTopic.subscribeQueue(
  "research", 
  researchQueue.arn, 
  {
      filter: {
          "queue": ["research"]
      }
  }
)
