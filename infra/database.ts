export const contentTable = new sst.aws.Dynamo("Content", {
    fields: {
        contentId: "string"
    },
    primaryIndex: {hashKey: "contentId"},
})
