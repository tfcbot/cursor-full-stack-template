/**
 * Task Usecase
 * 
 * This module provides the implementation for handling task requests.
 * It processes task prompts and returns comprehensive task results.
 */

import { Message } from '@metadata/message.schema';
import { GetTaskInput } from '@metadata/agents/agent.schema';
import { agentRepository } from '../adapters/secondary/datastore.adapter';

/**
 * Executes the task process for a given input
 * 
 * This usecase:
 * 1. Receives a task prompt
 * 2. Processes the request through the agent repository
 * 3. Returns the task results
 * 
 * @param input The task request containing the prompt
 * @returns A message with the task results
 */
export const getTaskUsecase = async (input: GetTaskInput): Promise<Message> => {
  console.info("Getting task for prompt");

  try {
    const task = await agentRepository.getTaskById(input.agentId);
    
    // Add validation to ensure users can only access their own tasks
    if (!task) {
      throw new Error('Task not found');
    }
    

    return {
      message: 'Task completed successfully',
      data: task,
    };
  } catch (error) {
    console.error('Error generating task:', error);
    throw new Error('Failed to generate task');
  }
};
