import { SaveTaskSchema, RequestTaskInput, TaskStatus } from '@metadata/agents/agent.schema';
import { Message } from '@metadata/message.schema';
import { runTask } from '../adapters/secondary/openai.adapter';
import { agentRepository } from '../adapters/secondary/datastore.adapter';

export const runTaskUsecase = async (input: RequestTaskInput): Promise<Message> => {
  console.info("Performing task for User");

  try {
    // Decrement token count  
    const task = await runTask(input);
    console.info("Task completed successfully");
    task.taskStatus = TaskStatus.COMPLETED; 
    const taskWithUserId = SaveTaskSchema.parse({
      ...task,
      userId: input.userId
    });
    const message = await agentRepository.saveTask(taskWithUserId);
    console.info("Task saved successfully");
    return {
      message: message
    };
  } catch (error) {
    throw new Error('Failed to perform task', { cause: error }  );
  }
};
