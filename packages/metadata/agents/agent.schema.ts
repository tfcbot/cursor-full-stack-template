import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

export enum AgentTaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed"
} 

export const RequestAgentTaskFormInputSchema = z.object({
    prompt: z.string(),
});

export const RequestAgentTaskInputSchema = z.object({
    prompt: z.string(),
    id: z.string().optional().default(uuidv4()),
    userId: z.string(),
    keyId: z.string(),
});

export const systemPrompt = `
You are an agent.

You are responsible for creating detailed output for a given task.

You will be given a prompt and you will need to create comprehensive output according to the prompt.

Search the web for relevant information and use it to create the output.

You will need to provide a list of citations for the output.

The citations should be in the format of a list of URLs.
`

export const userPromt = (input: RequestAgentTaskInput): string  => `
Generate output according to the following prompt:

${input.prompt}
`
export const PendingAgentTaskSchema = z.object({
    taskId: z.string(),
    userId: z.string(),
    title: z.string(), 
    content: z.string(),
    citation_links: z.array(z.string()),
    taskStatus: z.nativeEnum(AgentTaskStatus).default(AgentTaskStatus.PENDING),
});


export const RequestAgentTaskOutputSchema = z.object({
    taskId: z.string(),
    title: z.string(), 
    content: z.string(),
    citation_links: z.array(z.string()),
    taskStatus: z.nativeEnum(AgentTaskStatus).default(AgentTaskStatus.PENDING),
});

export const SaveAgentTaskSchema = z.object({
    taskId: z.string(),
    userId: z.string(),
    title: z.string(), 
    content: z.string(),
    citation_links: z.array(z.string()),
});

export const GetAgentTaskInputSchema = z.object({  
    userId: z.string(),
    taskId: z.string(),
});

export const GetAllUserTasksInputSchema = z.object({
    userId: z.string(),
});

export const citationsSchema = z.object({
    links: z.array(z.string())
  });

export type RequestAgentTaskOutput = z.infer<typeof RequestAgentTaskOutputSchema>;
export type RequestAgentTaskInput = z.infer<typeof RequestAgentTaskInputSchema>;
export type GetAgentTaskInput = z.infer<typeof GetAgentTaskInputSchema>; 
export type RequestAgentTaskFormInput = z.infer<typeof RequestAgentTaskFormInputSchema>;
export type GetAllUserTasksInput = z.infer<typeof GetAllUserTasksInputSchema>;
export type SaveAgentTaskInput = z.infer<typeof SaveAgentTaskSchema>;
export type PendingAgentTask = z.infer<typeof PendingAgentTaskSchema>;

// For backward compatibility with existing code
export const ResearchStatus = AgentTaskStatus;
export const RequestResearchFormInputSchema = RequestAgentTaskFormInputSchema;
export const RequestResearchInputSchema = RequestAgentTaskInputSchema;
export const PendingResearchSchema = PendingAgentTaskSchema;
export const RequestResearchOutputSchema = RequestAgentTaskOutputSchema;
export const SaveResearchSchema = SaveAgentTaskSchema;
export const GetResearchInputSchema = GetAgentTaskInputSchema;
export const GetAllUserResearchInputSchema = GetAllUserTasksInputSchema;
export type RequestResearchOutput = RequestAgentTaskOutput;
export type RequestResearchInput = RequestAgentTaskInput;
export type GetResearchInput = GetAgentTaskInput;
export type RequestResearchFormInput = RequestAgentTaskFormInput;
export type GetAllUserResearchInput = GetAllUserTasksInput;
export type SaveResearchInput = SaveAgentTaskInput;
export type PendingResearch = PendingAgentTask;
