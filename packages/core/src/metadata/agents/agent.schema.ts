import { z } from "zod";

/**
 * Enum for task status
 */
export enum TaskStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

/**
 * Schema for task request input
 */
export const RequestTaskInputSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  keyId: z.string().optional(),
  prompt: z.string().min(1),
});

/**
 * Schema for task form input (client-side)
 */
export const RequestTaskFormInputSchema = z.object({
  prompt: z.string().min(1),
});

/**
 * Schema for pending task
 */
export const PendingTaskSchema = z.object({
  agentId: z.string().uuid(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  citation_links: z.array(z.string()).optional(),
  taskStatus: z.nativeEnum(TaskStatus),
  summary: z.string().optional(),
});

/**
 * Schema for completed task
 */
export const CompletedTaskSchema = z.object({
  agentId: z.string().uuid(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  citation_links: z.array(z.string()).optional(),
  taskStatus: z.nativeEnum(TaskStatus),
  summary: z.string().optional(),
});

/**
 * Schema for saving task to database
 */
export const SaveTaskSchema = z.object({
  agentId: z.string().uuid(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  citation_links: z.array(z.string()).optional(),
  taskStatus: z.nativeEnum(TaskStatus),
  summary: z.string().optional(),
});

/**
 * Schema for task output
 */
export const RequestTaskOutputSchema = z.object({
  agentId: z.string().uuid(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  citation_links: z.array(z.string()).optional(),
  taskStatus: z.nativeEnum(TaskStatus),
  summary: z.string().optional(),
});

/**
 * Schema for getting a task by ID
 */
export const GetTaskInputSchema = z.object({
  agentId: z.string().uuid(),
});

/**
 * Schema for getting all tasks for a user
 */
export const GetAllUserTasksInputSchema = z.object({
  userId: z.string(),
});

// Type definitions
export type RequestTaskInput = z.infer<typeof RequestTaskInputSchema>;
export type RequestTaskFormInput = z.infer<typeof RequestTaskFormInputSchema>;
export type PendingTask = z.infer<typeof PendingTaskSchema>;
export type CompletedTask = z.infer<typeof CompletedTaskSchema>;
export type SaveTask = z.infer<typeof SaveTaskSchema>;
export type RequestTaskOutput = z.infer<typeof RequestTaskOutputSchema>;
export type GetTaskInput = z.infer<typeof GetTaskInputSchema>;
export type GetAllUserTasksInput = z.infer<typeof GetAllUserTasksInputSchema>;
