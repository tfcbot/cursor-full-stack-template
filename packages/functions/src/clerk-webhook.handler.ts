import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { SaaSIdentityVendingMachine } from '../../utils/src/tools/saas-identity';
import { MessageSchema } from '../../metadata/saas-identity.schema';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const saasIdentity = new SaaSIdentityVendingMachine();
    
    try {
      const webhookEvent = await saasIdentity.validateWebhook(event);
      
      const eventType = webhookEvent.type;
      console.log(`Processing Clerk webhook event: ${eventType}`);
      
      if (eventType === 'user.created') {
        const userId = webhookEvent.data.id;
        console.log(`New user created with ID: ${userId}`);
      }
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Webhook processed successfully' 
        })
      };
    } catch (error) {
      console.error('Error validating webhook:', error);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Invalid webhook payload' 
        })
      };
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Internal server error' 
      })
    };
  }
};
