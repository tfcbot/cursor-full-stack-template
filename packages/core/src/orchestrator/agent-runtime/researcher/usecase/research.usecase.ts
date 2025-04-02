import { RequestResearchInput } from '@metadata/agents/research-agent.schema';
import { Message } from '@metadata/message.schema';
import { runResearch } from '../adapters/secondary/openai.adapter';
import { researchRepository } from '../adapters/secondary/datastore.adapter';


export const runResearchUsecase = async (input: RequestResearchInput): Promise<Message> => {
  console.info("Performing research for User");

  try {
    const research = await runResearch(input);
    console.info("Research completed successfully");

    await researchRepository.saveResearch(research);
    return {
      message: 'Research completed successfully',
    };

  } catch (error) {
    console.error('Error performing research:', error);
    throw new Error('Failed to perform research');
  }
};
