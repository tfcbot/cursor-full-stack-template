import { GetUserCreditsInput } from "@metadata/credits.schema";
import { apiKeyAdapter } from "../adapters/secondary/api-key.adapter";

export async function getUserCreditsUseCase(input: GetUserCreditsInput) {
  try {
    // Get the user's active API key
    const { result: userResponse } = await apiKeyAdapter.unkey.apis.getKeys({
      apiId: apiKeyAdapter.apiId,
      ownerId: input.userId,
      limit: 1
    });
    
    if (!userResponse.keys || userResponse.keys.length === 0) {
      return { credits: 0 };
    }
    
    const keyId = userResponse.keys[0].id;
    const credits = await apiKeyAdapter.getRemainingCredits(keyId);
    
    return { 
      credits,
      userId: input.userId
    };
  } catch (error) {
    console.error("Error getting user credits:", error);
    // Return 0 credits on error to avoid breaking user experience
    return { credits: 0, userId: input.userId };
  }
}
