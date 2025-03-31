import { deepResearchTable } from "./database"
import { secrets } from "./secrets"



export const deepResearchQueue = new sst.aws.Queue("DeepResearchQueue")   



deepResearchQueue.subscribe({
    handler: "./packages/functions/src/agent-runtime.api.deepResearchHandler", 
    link: [
        deepResearchTable, 
        ...secrets, 
    ], 
    permissions: [
        {
            actions: ["dynamodb:*"], 
            resources: [deepResearchTable.arn]
        }
    ],
})


    