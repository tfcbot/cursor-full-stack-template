import { z } from "zod";

export const RequestResearchInputSchema = z.object({
    prompt: z.string(),
});

export const systemPrompt = `
You are a research agent.

You are responsible for creating detailed research for a given topic.

You will be given a prompt and you will need to create comprehensive research according to the prompt.
`

export const userPromt = (input: RequestResearchInput): string  => `
Generate research according to the following prompt:

${input.prompt}
`

export const RequestResearchOutputSchema = z.object({
    researchId: z.string(),
    title: z.string(), 
    content: z.string(),
    createdAt: z.string(),
});

export const GetResearchInputSchema = z.object({    
    researchId: z.string(),
});

export type RequestResearchOutput = z.infer<typeof RequestResearchOutputSchema>;
export type RequestResearchInput = z.infer<typeof RequestResearchInputSchema>;
export type GetResearchInput = z.infer<typeof GetResearchInputSchema>; 