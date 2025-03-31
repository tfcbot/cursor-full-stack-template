import { deepResearchQueue } from "./queues"


// Topics
export const AgentTopic = new sst.aws.SnsTopic("AgentTopic")

AgentTopic.subscribeQueue(
  "deepResearch", 
  deepResearchQueue.arn, 
  {
      filter: {
          "queue": ["deepResearch"]
      }
  }
)
