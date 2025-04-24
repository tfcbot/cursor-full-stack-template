import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed"
} 


export const RequestTaskFormInputSchema = z.object({
    prompt: z.string(),
});

export const RequestTaskInputSchema = z.object({
    prompt: z.string(),
    id: z.string().optional().default(uuidv4()),
    userId: z.string(),
    keyId: z.string(),
});

export const systemPrompt = `
You are an agent.

You are responsible for creating detailed responses for a given task.

You will be given a prompt and you will need to create comprehensive output according to the prompt.

Search the web for relevant information and use it to create the response.

You will need to provide a list of citations for the response.

The citations should be in the format of a list of URLs.
`

export const userPromt = (input: RequestTaskInput): string  => `
Generate a response according to the following prompt:

${input.prompt}
`
export const PendingTaskSchema = z.object({
    agentId: z.string(),
    userId: z.string(),
    title: z.string(), 
    content: z.string(),
    citation_links: z.array(z.string()),
    taskStatus: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
});


export const RequestTaskOutputSchema = z.object({
    agentId: z.string(),
    title: z.string(), 
    content: z.string(),
    citation_links: z.array(z.string()),
    taskStatus: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
});

export const SaveTaskSchema = z.object({
    agentId: z.string(),
    userId: z.string(),
    title: z.string(), 
    content: z.string(),
    citation_links: z.array(z.string()),
});

export const GetTaskInputSchema = z.object({  
    userId: z.string(),
    agentId: z.string(),
});

export const GetAllUserTasksInputSchema = z.object({
    userId: z.string(),
});

export const citationsSchema = z.object({
    links: z.array(z.string())
  });

export type RequestTaskOutput = z.infer<typeof RequestTaskOutputSchema>;
export type RequestTaskInput = z.infer<typeof RequestTaskInputSchema>;
export type GetTaskInput = z.infer<typeof GetTaskInputSchema>; 
export type RequestTaskFormInput = z.infer<typeof RequestTaskFormInputSchema>;
export type GetAllUserTasksInput = z.infer<typeof GetAllUserTasksInputSchema>;
export type SaveTaskInput = z.infer<typeof SaveTaskSchema>;
export type PendingTask = z.infer<typeof PendingTaskSchema>;
