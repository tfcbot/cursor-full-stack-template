import { Queue, Topic } from "./orchestrator.schema";
import { z } from "zod";
import { RequestDeepResearchInputSchema } from "./agents/deep-research-agent.schema";

export const AgentMessageSchema = z.object({
  topic: z.nativeEnum(Topic),
  id: z.string(),
  timestamp: z.string(),
  queue: z.string(),
  payload: z.any(),
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

export const DeepResearchRequestTaskSchema = AgentMessageSchema.extend({
  payload: RequestDeepResearchInputSchema,
});

export type DeepResearchRequestTask = z.infer<typeof DeepResearchRequestTaskSchema>;

export type Task =
  | AgentMessage
  | DeepResearchRequestTask;



