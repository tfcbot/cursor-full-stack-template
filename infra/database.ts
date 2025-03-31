export const deepResearchTable = new sst.aws.Dynamo("DeepResearch", {
    fields: {
        deepResearchId: "string"
    },
    primaryIndex: {hashKey: "deepResearchId"},
})
