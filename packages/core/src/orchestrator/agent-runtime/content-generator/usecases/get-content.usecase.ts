import { contentRepository } from '../adapters/secondary/datastore.adapter';
import { RequestContentInput } from '@metadata/agents/content-agent.schema';
import { Message } from '@metadata/message.schema';

export const getContentUsecase = async (input: RequestContentInput): Promise<Message> => {
  console.info("Getting content for User");

  try {
    const content = await contentRepository.getContentByUserId(input.userId);
    return {
      message: 'Content retrieved successfully',
      data: content,
    };
  } catch (error) {
    console.error('Error getting content:', error);
    throw new Error('Failed to get content');
  }
}