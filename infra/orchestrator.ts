import { researchTable } from "./database"
import { secrets } from "./secrets"

// Topics
export const TaskTopic = new sst.aws.SnsTopic("TaskTopic", {
  fifo: true
})

export const researchQueue = new sst.aws.Queue("ResearchQueue")  


TaskTopic.subscribeQueue(
  "ResearchQueue", 
  researchQueue.arn, 
  {
    filter: {
      "queue": ["research"]
    }
  }
)


researchQueue.subscribe({
  handler: "./packages/functions/src/agent-runtime.api.generateResearchReportHandler", 
  link: [
      researchTable, 
      ...secrets,
      TaskTopic
  ], 
  permissions: [
    {
      actions: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Query"], 
      resources: [researchTable.arn]
    }, 
  ],
})

