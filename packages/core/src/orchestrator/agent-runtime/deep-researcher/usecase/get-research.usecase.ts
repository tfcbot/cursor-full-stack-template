/**
 * Deep Research Usecase
 * 
 * This module provides the implementation for handling deep research requests.
 * It processes research prompts and returns comprehensive research results.
 */

import { Message } from '@metadata/message.schema';
import { GetResearchInput } from '@metadata/agents/deep-research-agent.schema';
import { deepResearchRepository } from '../adapters/secondary/datastore.adapter';

/**
 * Executes the deep research process for a given input
 * 
 * This usecase:
 * 1. Receives a research prompt
 * 2. Processes the request through the deep research repository
 * 3. Returns the research results
 * 
 * @param input The research request containing the prompt
 * @returns A message with the research results
 */
export const getResearchUsecase = async (input: GetResearchInput): Promise<Message> => {
  console.info("Getting deep research for prompt");

  try {
    const research = await deepResearchRepository.getDeepResearchByUserId(input.userId);
    return {
      message: 'Deep research completed successfully',
      data: research,
    };
  } catch (error) {
    console.error('Error generating deep research:', error);
    throw new Error('Failed to generate deep research');
  }
};
