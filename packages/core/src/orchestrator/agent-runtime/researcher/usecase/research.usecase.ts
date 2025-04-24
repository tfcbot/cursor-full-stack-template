import { SaveAgentTaskSchema, RequestAgentTaskInput, AgentTaskStatus } from '@metadata/agents/agent.schema';
import { Message } from '@metadata/message.schema';
import { runAgentTask } from '../adapters/secondary/openai.adapter';
import { agentTaskRepository } from '../adapters/secondary/datastore.adapter';

export const runAgentTaskUsecase = async (input: RequestAgentTaskInput): Promise<Message> => {
  console.info("Performing agent task for User");

  try {
    // Execute the agent task
    const task = await runAgentTask(input);
    console.info("Agent task completed successfully");
    task.taskStatus = AgentTaskStatus.COMPLETED; 
    const taskWithUserId = SaveAgentTaskSchema.parse({
      ...task,
      userId: input.userId
    });
    const message = await agentTaskRepository.saveTask(taskWithUserId);
    console.info("Agent task saved successfully");
    return {
      message: message
    };
  } catch (error) {
    throw new Error('Failed to perform agent task', { cause: error }  );
  }
};

// For backward compatibility
export const runResearchUsecase = runAgentTaskUsecase;
