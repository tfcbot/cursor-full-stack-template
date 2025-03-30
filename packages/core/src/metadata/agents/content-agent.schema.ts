import { z } from "zod";


export const ContentRequestInputSchema = z.object({
    request: z.string(),
});


export const systemPromptSchema = `
You are a content agent.

You are responsible for creating content for a given topic.`

export const userPromt = (input: ContentRequestInput): string  => `

Generate content according to the following request:

${input.request}    

`
export const ContentRequestOutputSchema = z.object({
    content: z.string(),
});

export type ContentRequestOutput = z.infer<typeof ContentRequestOutputSchema>;
export type ContentRequestInput = z.infer<typeof ContentRequestInputSchema>;


