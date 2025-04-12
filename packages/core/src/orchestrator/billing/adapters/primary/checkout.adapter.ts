import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'; 
import { createCheckoutSessionUseCase } from '../../usecases/checkout.usecase';
import { 
  CheckoutSessionInput, 
  CheckoutSessionInputSchema 
} from '@metadata/credits.schema';
import { SaaSIdentityVendingMachine } from '@utils/tools/saas-identity';

export const checkoutAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const body = JSON.parse(event.body);
    const svm = new SaaSIdentityVendingMachine();
    const validUser = await svm.getValidUser(event);
    
    const params: CheckoutSessionInput = CheckoutSessionInputSchema.parse({ 
      ...body, 
      userId: validUser.userId 
    });
    
    const session = await createCheckoutSessionUseCase(params);  

    return {
      statusCode: 200,
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error('Error processing checkout:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 400,
      body: JSON.stringify({ error: error.message || 'Invalid request' }),
    };
  }
};
