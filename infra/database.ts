export const agentTasksTable = new sst.aws.Dynamo("AgentTasks", {
    fields: {
        userId: "string",
        taskId: "string",
        taskStatus: "string",
    },
    primaryIndex: {hashKey: "taskId"},
    globalIndexes: {
        UserIdIndex: { hashKey: "userId" },
        StatusIndex: { hashKey: "taskStatus" }
    }
})

// For backward compatibility
export const researchTable = agentTasksTable;

export const usersTable = new sst.aws.Dynamo("Users", {
    fields: {
        userId: "string"
    },
    primaryIndex: {hashKey: "userId"},
})

export const userKeysTable = new sst.aws.Dynamo("UserKeys", {
    fields: {
        keyId: "string",
        userId: "string",
        apiKeystatus: "string"
    },
    primaryIndex: {hashKey: "userId"},
    globalIndexes: {
        KeyIdIndex: { hashKey: "keyId" }, 
        StatusIndex: { hashKey: "apiKeystatus" }
    }
})
