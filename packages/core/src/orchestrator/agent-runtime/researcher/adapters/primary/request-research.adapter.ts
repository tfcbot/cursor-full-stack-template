import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { RequestAgentTaskFormInput, RequestAgentTaskInput, RequestAgentTaskInputSchema } from "@metadata/agents/agent.schema";
import { runAgentTaskUsecase } from "../../usecase/research.usecase";
import { HttpResponse } from "@utils/tools/http-status";
import { SaasIdentity } from "@utils/tools/saas-identity";

export const requestAgentTaskAdapter = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  try {
    const saasIdentity = new SaasIdentity(event);
    const userId = saasIdentity.getUserId();
    const keyId = saasIdentity.getKeyId();

    if (!userId) {
      return HttpResponse.unauthorized("User not authenticated");
    }

    if (!event.body) {
      return HttpResponse.badRequest("Missing request body");
    }

    const requestBody = JSON.parse(event.body) as RequestAgentTaskFormInput;
    
    const input = RequestAgentTaskInputSchema.parse({
      ...requestBody,
      userId,
      keyId
    });

    const result = await runAgentTaskUsecase(input);
    
    return HttpResponse.ok(result);
  } catch (error) {
    console.error("Error in requestAgentTaskAdapter:", error);
    return HttpResponse.internalServerError("Failed to process request");
  }
};

// For backward compatibility
export const requestResearchAdapter = requestAgentTaskAdapter;
