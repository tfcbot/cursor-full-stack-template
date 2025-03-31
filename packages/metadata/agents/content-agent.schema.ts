import { z } from "zod";


export const RequestContentInputSchema = z.object({
    userId: z.string(),
    prompt: z.string(),
});


export const systemPromptSchema = `
You are a content agent.

You are responsible for creating content for a given topic.

You will be given a prompt and you will need to create content according to the prompt.
`

export const userPromt = (input: RequestContentInput): string  => `

Generate content according to the following prompt:

${input.prompt}    

`
export const RequestContentOutputSchema = z.object({
    content: z.string(),
});

export type RequestContentOutput = z.infer<typeof RequestContentOutputSchema>;
export type RequestContentInput = z.infer<typeof RequestContentInputSchema>;


