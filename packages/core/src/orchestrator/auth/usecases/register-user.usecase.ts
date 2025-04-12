import { NewUser } from '@metadata/user.schema';
import { userAdapter } from '../adapters/secondary/user-management.adapter';

export async function registerUserUseCase(newUserData: NewUser): Promise<{ message: string }> {
  console.info("Processing register user usecase for:", newUserData.userId);
  
  try {
    // Store user in database
    await userAdapter.registerUser(newUserData);
    
    // Here you can also add code to:
    // 1. Create initial API keys for the user
    // 2. Send welcome emails
    // 3. Set up default preferences
    // 4. Assign to user groups
    
    return {
      message: 'User registered successfully'
    };
  } catch (error) {
    console.error('Failed to register user:', error);
    throw new Error('User registration failed');
  }
} 