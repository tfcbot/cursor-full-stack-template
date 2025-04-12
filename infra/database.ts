export const researchTable = new sst.aws.Dynamo("Research", {
    fields: {
        researchId: "string"
    },
    primaryIndex: {hashKey: "researchId"},
})

export const usersTable = new sst.aws.Dynamo("Users", {
    fields: {
        userId: "string"
    },
    primaryIndex: {hashKey: "userId"},
})

export const apiKeysTable = new sst.aws.Dynamo("ApiKeys", {
    fields: {
        keyId: "string",
        userId: "string",
        apiKey: "string"
    },
    primaryIndex: {hashKey: "keyId"},
    globalIndexes: {
        ApiKeyIndex: { hashKey: "apiKey" }
    }
})
