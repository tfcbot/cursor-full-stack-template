/**
 * Get All Research Usecase
 * 
 * This module provides the implementation for retrieving all research entries.
 * It processes the request and returns a list of all research results.
 */

import { Message } from '@metadata/message.schema';
import { RequestResearchOutput } from '@metadata/agents/research-agent.schema';
import { researchRepository } from '../adapters/secondary/datastore.adapter';

/**
 * Executes the process to retrieve all research entries
 * 
 * This usecase:
 * 1. Processes the request through the research repository
 * 2. Returns all research results
 * 
 * @returns A message with all research results
 */
export const getAllResearchUsecase = async (): Promise<Message> => {
  console.info("Getting all research entries");

  try {
    // Since we don't have a userId in this context, we're getting all research
    // In a real application, you might want to filter by userId or other criteria
    const allResearch = await researchRepository.getAllResearch();
    
    // Ensure we're returning an array even if the database returns null or undefined
    const safeResearchList: RequestResearchOutput[] = allResearch || [];
    
    return {
      message: 'All research retrieved successfully',
      data: safeResearchList, // Return the array directly, not nested in 'data'
    };
  } catch (error) {
    console.error('Error retrieving research:', error);
    throw new Error('Failed to retrieve research');
  }
}; 