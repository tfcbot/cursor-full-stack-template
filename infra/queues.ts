import { contentTable } from "./database"
import { secrets } from "./secrets"



export const contentQueue = new sst.aws.Queue("ContentQueue")   



contentQueue.subscribe({
    handler: "./packages/functions/src/agent-runtime.api.contentHandler", 
    link: [
        contentTable, 
        ...secrets, 
    ], 
    permissions: [
        {
            actions: ["dynamodb:*"], 
            resources: [contentTable.arn]
        }
    ],
})


    