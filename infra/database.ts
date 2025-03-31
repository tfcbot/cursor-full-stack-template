export const researchTable = new sst.aws.Dynamo("Research", {
    fields: {
        researchId: "string"
    },
    primaryIndex: {hashKey: "researchId"},
})
