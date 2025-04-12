import { WebhookEvent } from '@clerk/backend';

export async function processWebhookUseCase(event: WebhookEvent) {
  console.log('Processing auth webhook event:', event.type);
  
  try {
    switch (event.type) {
      case 'user.created':
        return await handleUserCreated(event.data);
      case 'user.updated':
        return await handleUserUpdated(event.data);
      case 'user.deleted':
        return await handleUserDeleted(event.data);
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return { status: 'ignored', event: event.type };
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}

async function handleUserCreated(userData: any) {
  console.log('Handling user created:', userData.id);
  
  try {
    // Here you would add code to handle a new user creation
    // For example, create a default API key or add the user to your database
    
    return {
      status: 'success',
      userId: userData.id,
      action: 'user_created'
    };
  } catch (error) {
    console.error('Error handling user created:', error);
    throw error;
  }
}

async function handleUserUpdated(userData: any) {
  console.log('Handling user updated:', userData.id);
  
  try {
    // Here you would add code to handle user updates
    // For example, update user metadata in your database
    
    return {
      status: 'success',
      userId: userData.id,
      action: 'user_updated'
    };
  } catch (error) {
    console.error('Error handling user updated:', error);
    throw error;
  }
}

async function handleUserDeleted(userData: any) {
  console.log('Handling user deleted:', userData.id);
  
  try {
    // Here you would add code to handle user deletion
    // For example, remove user data from your database or deactivate their account
    
    return {
      status: 'success',
      userId: userData.id,
      action: 'user_deleted'
    };
  } catch (error) {
    console.error('Error handling user deleted:', error);
    throw error;
  }
} 