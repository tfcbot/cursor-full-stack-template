/**
 * Research Usecase
 * 
 * This module provides the implementation for handling research requests.
 * It processes research prompts and returns comprehensive research results.
 */

import { Message } from '@metadata/message.schema';
import { GetResearchInput } from '@metadata/agents/research-agent.schema';
import { researchRepository } from '../adapters/secondary/datastore.adapter';

/**
 * Executes the research process for a given input
 * 
 * This usecase:
 * 1. Receives a research prompt
 * 2. Processes the request through the research repository
 * 3. Returns the research results
 * 
 * @param input The research request containing the prompt
 * @returns A message with the research results
 */
export const getResearchUsecase = async (input: GetResearchInput): Promise<Message> => {
  console.info("Getting research for prompt");

  try {
    const research = await researchRepository.getResearchByUserId(input.userId);
    return {
      message: 'Research completed successfully',
      data: research,
    };
  } catch (error) {
    console.error('Error generating research:', error);
    throw new Error('Failed to generate research');
  }
};
