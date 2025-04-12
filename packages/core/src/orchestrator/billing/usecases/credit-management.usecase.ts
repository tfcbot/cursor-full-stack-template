import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { GetUserCreditsInput } from "@metadata/credits.schema";

const client = new DynamoDBClient({});
const dynamoClient = DynamoDBDocumentClient.from(client);

export async function getUserCreditsUseCase(input: GetUserCreditsInput) {
  try {
    const params = {
      TableName: "Users",
      Key: { userId: input.userId }
    };

    const command = new GetCommand(params);
    const result = await dynamoClient.send(command);
    const user = result.Item;

    if (!user) {
      return { credits: 0 };
    }

    return { 
      credits: user.credits || 0,
      userId: user.userId
    };
  } catch (error) {
    console.error("Error getting user credits:", error);
    throw error;
  }
}
