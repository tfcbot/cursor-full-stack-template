import { 
  CheckoutSessionInput, 
  TransactionType, 
  UpdateUserCreditsCommand 
} from '@metadata/credits.schema';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  UpdateCommand, 
  GetCommand 
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const dynamoClient = DynamoDBDocumentClient.from(client);
const Stripe = require('stripe');

export async function createSession(params: CheckoutSessionInput) {
  console.log('Creating checkout session for user:', params.userId);
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const redirectSuccessUrl = process.env.REDIRECT_SUCCESS_URL || 'http://localhost:3000/dashboard';
  const redirectFailureUrl = process.env.REDIRECT_FAILURE_URL || 'http://localhost:3000/dashboard';
  const idempotencyKey = randomUUID();

  try {
    const creditsPerUnit = 5;
    const totalCredits = params.quantity * creditsPerUnit;

    const metadata = {
      userId: params.userId,
      amount: totalCredits
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Credits Pack',
              description: `${creditsPerUnit} Credits`,
            },
            unit_amount: 500, // $5.00 per unit
          },
          quantity: params.quantity,
        },
      ],
      mode: 'payment',
      success_url: redirectSuccessUrl,
      cancel_url: redirectFailureUrl,
      metadata: metadata
    }, {
      idempotencyKey
    });

    return { id: session.id };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function updateUserCredits(command: UpdateUserCreditsCommand) {
  console.log('Updating user credits for:', command.userId);
  try {
    const getUserParams = {
      TableName: "Users",
      Key: { userId: command.userId }
    };
    
    const getUserCommand = new GetCommand(getUserParams);
    const userResult = await dynamoClient.send(getUserCommand);
    const user = userResult.Item || { userId: command.userId, credits: 0 };
    
    const currentCredits = user.credits || 0;
    let newCredits = currentCredits;
    
    if (command.operation === 'increment') {
      newCredits = currentCredits + command.amount;
    } else {
      newCredits = Math.max(0, currentCredits - command.amount);
      if (currentCredits < command.amount) {
        throw new Error('Insufficient credits');
      }
    }
    
    const updateParams = {
      TableName: "Users",
      Key: { userId: command.userId },
      UpdateExpression: 'SET credits = :credits',
      ExpressionAttributeValues: {
        ':credits': newCredits,
      }
    };
    
    const updateCommand = new UpdateCommand(updateParams);
    await dynamoClient.send(updateCommand);
    
    const transactionParams = {
      TableName: "Transactions",
      Item: {
        userId: command.userId,
        timestamp: new Date().toISOString(),
        amount: command.amount,
        type: command.operation === 'increment' ? TransactionType.CREDIT : TransactionType.DEBIT,
        keyId: command.keyId || null
      }
    };
    
    const transactionCommand = new PutCommand(transactionParams);
    await dynamoClient.send(transactionCommand);
    
    return { credits: newCredits };
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}
