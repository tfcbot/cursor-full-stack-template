import { ContentRequestInput } from '@metadata/agents/content-agent.schema';
import { runContent } from '@agent-runtime/content-generator/adapters/secondary/openai.adapter';
import { Message } from '@utils/metadata/message.schema';

export const createContentUsecase = async (input: ContentRequestInput): Promise<Message> => {
  console.info("Creating content for User");

  try {
      const content = await runContent(input);

    return {
      message: 'Content created successfully',
    };

  } catch (error) {
    console.error('Error generating growth strategy:', error);
    throw new Error('Failed to generate growth strategy');
  }
};
