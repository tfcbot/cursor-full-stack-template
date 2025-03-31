import { Queue, Topic } from "./orchestrator.schema";
import { z } from "zod";
import { ContentRequestInputSchema } from "./agents/content-agent.schema";


export const AgentMessageSchema = z.object({
   topic: z.nativeEnum(Topic),
   queue: z.nativeEnum(Queue),
   payload: z.object({
      id: z.string(),
      message: z.any()
    })
})

export const ContentRequestTaskSchema = AgentMessageSchema.extend({
   payload: ContentRequestInputSchema,
});


export type AgentMessage = z.infer<typeof AgentMessageSchema>
export type ContentRequestTask = z.infer<typeof ContentRequestTaskSchema>

export type TaskType =
   | ContentRequestTask



