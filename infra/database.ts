import * as sst from "sst";

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

export const transactionsTable = new sst.aws.Dynamo("Transactions", {
    fields: {
        userId: "string",
        timestamp: "string",
    },
    primaryIndex: {hashKey: "userId", sortKey: "timestamp"},
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
