export const agentTable = new sst.aws.Dynamo("Agent", {
    fields: {
        userId: "string",
        agentId: "string",
        taskStatus: "string",
    },
    primaryIndex: {hashKey: "agentId"},
    globalIndexes: {
        UserIdIndex: { hashKey: "userId" },
        StatusIndex: { hashKey: "taskStatus" }
    }
})


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
