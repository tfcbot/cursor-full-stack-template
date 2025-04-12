import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NewUser, User, UpdateUserOnboardingDetailsInput } from '@metadata/user.schema';

export interface IUserAdapter {
  registerUser(user: NewUser): Promise<void>;
  getUserData(userId: string): Promise<User | null>;
  updateUserOnboardingDetails(input: UpdateUserOnboardingDetailsInput): Promise<void>;
}

export class UserAdapter implements IUserAdapter {
  private dynamoClient: DynamoDBDocumentClient;

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async registerUser(user: NewUser): Promise<void> {
    console.info("Registering user in DynamoDB:", user.userId);
    try {
      // Add timestamps
      const now = new Date().toISOString();
      const userData = {
        ...user,
        createdAt: now,
        updatedAt: now
      };
      
      const command = new PutCommand({
        TableName: "Users",
        Item: userData,
      });
    
      await this.dynamoClient.send(command);
      console.info("User registered successfully:", user.userId);
    } catch (error) {
      console.error('Error creating user in DynamoDB:', error);
      throw new Error('Failed to create user');
    }
  }

  async getUserData(userId: string): Promise<User | null> {
    try {
      const command = new GetCommand({
        TableName: "Users",
        Key: { userId }
      });

      const result = await this.dynamoClient.send(command);
      if (!result.Item) {
        return null;
      }

      return result.Item as User;
    } catch (error) {
      console.error('Error fetching user data from DynamoDB:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  async updateUserOnboardingDetails(input: UpdateUserOnboardingDetailsInput): Promise<void> {
    try {
      // Remove userId from the fields to update
      const { userId, ...updateFields } = input;

      // Dynamically build update expression and attribute values
      const updateExpressionParts: string[] = [];
      const expressionAttributeValues: Record<string, any> = {};
      const expressionAttributeNames: Record<string, string> = {};

      // Always update the updatedAt timestamp
      updateExpressionParts.push('#updatedAt = :updatedAt');
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();
      expressionAttributeNames['#updatedAt'] = 'updatedAt';

      // Handle onboardingComplete by mapping to onboardingStatus
      if (updateFields.onboardingComplete !== undefined) {
        updateExpressionParts.push('#onboardingStatus = :onboardingStatus');
        expressionAttributeValues[':onboardingStatus'] = updateFields.onboardingComplete ? 
          'COMPLETE' : 'IN_PROGRESS';
        expressionAttributeNames['#onboardingStatus'] = 'onboardingStatus';
      }

      // Handle any additional fields in onboardingDetails
      if (updateFields.onboardingDetails) {
        Object.entries(updateFields.onboardingDetails).forEach(([key, value]) => {
          const attributeName = `#${key}`;
          const attributeValue = `:${key}`;
          updateExpressionParts.push(`${attributeName} = ${attributeValue}`);
          expressionAttributeValues[attributeValue] = value;
          expressionAttributeNames[attributeName] = key;
        });
      }

      const command = new UpdateCommand({
        TableName: "Users",
        Key: { userId },
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames
      });

      await this.dynamoClient.send(command);
      console.info("User onboarding details updated successfully:", userId);
    } catch (error) {
      console.error('Error updating user onboarding details in DynamoDB:', error);
      throw new Error('Failed to update user onboarding details');
    }
  }
}

// Export singleton instance
export const userAdapter: IUserAdapter = new UserAdapter(); 