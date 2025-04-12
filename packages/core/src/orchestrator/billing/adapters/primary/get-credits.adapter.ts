import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getUserCreditsUseCase } from '../../usecases/credit-management.usecase';
import { GetUserCreditsInput, GetUserCreditsInputSchema } from '@metadata/credits.schema';
import { SaaSIdentityVendingMachine } from '@utils/tools/saas-identity';

export const getUserCreditsAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const svm = new SaaSIdentityVendingMachine();
    const validUser = await svm.getValidUser(event);
    
    const params: GetUserCreditsInput = GetUserCreditsInputSchema.parse({
      userId: validUser.userId
    });
    
    const result = await getUserCreditsUseCase(params);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error getting user credits:', error);
    return {
      statusCode: error instanceof Error ? (error.message === 'Unauthorized' ? 401 : 400) : 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid request' }),
    };
  }
};
