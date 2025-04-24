/**
 * Get User Tasks Usecase
 * 
 * This module provides the implementation for retrieving all task entries for a specific user.
 * It processes the request and returns a list of task results for the authenticated user.
 */

import { Message } from '@metadata/message.schema';
import { RequestTaskOutput, GetAllUserTasksInput } from '@metadata/agents/agent.schema';
import { agentRepository } from '../adapters/secondary/datastore.adapter';

/**
 * Executes the process to retrieve all task entries for a user
 * 
 * This usecase:
 * 1. Processes the request through the agent repository
 * 2. Returns all task results for the specified user
 * 
 * @param input - The input containing the user ID
 * @returns A message with the user's task results
 */
export const getUserTasksUsecase = async (input: GetAllUserTasksInput): Promise<Message> => {
  console.info("Getting task entries for user:", input.userId);

  try {
    const userTasks = await agentRepository.getTasksByUserId(input.userId);
    
    return {
      message: 'User tasks retrieved successfully',
      data: userTasks,
    };
  } catch (error) {
    console.error('Error retrieving user tasks:', error);
    throw new Error('Failed to retrieve user tasks');
  }
};
