import { researchTable } from "./database"
import { secrets } from "./secrets"



export const researchQueue = new sst.aws.Queue("ResearchQueue")   



researchQueue.subscribe({
    handler: "./packages/functions/src/agent-runtime.api.researchHandler", 
    link: [
        researchTable, 
        ...secrets, 
    ], 
    permissions: [
        {
            actions: ["dynamodb:*"], 
            resources: [researchTable.arn]
        }
    ],
})


    