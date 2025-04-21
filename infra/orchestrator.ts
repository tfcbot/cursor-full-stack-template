import { researchTable, eventDeduplicationTable } from "./database"
import { secrets } from "./secrets"

// EventBridge Bus
export const TaskBus = new sst.aws.Bus("TaskBus")

// Subscribe the research lambda to the bus
TaskBus.subscribe("ResearchSubscriber", {
  handler: "./packages/functions/src/agent-runtime.api.generateResearchReportHandler",
  pattern: {
    source: ["task"],
    detail: {
      queue: ["research"]
    }
  }
})

// Link the bus to resources
new sst.aws.Function("ResearchFunction", {
  handler: "./packages/functions/src/agent-runtime.api.generateResearchReportHandler",
  link: [
    researchTable,
    eventDeduplicationTable,
    ...secrets,
    TaskBus
  ],
  permissions: [
    {
      actions: [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      resources: [
        researchTable.arn,
        eventDeduplicationTable.arn
      ]
    },
  ],
})
