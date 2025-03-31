import { z } from "zod";

export const RequestDeepResearchInputSchema = z.object({
    userId: z.string(),
    researchId: z.string(),
    prompt: z.string(),
});

export const systemPrompt = `
You are a deep research agent.

You are responsible for creating detailed research for a given topic.

You will be given a prompt and you will need to create comprehensive deep research according to the prompt.
`

export const userPromt = (input: RequestDeepResearchInput): string  => `
Generate deep research according to the following prompt:

${input.prompt}
`

export const RequestDeepResearchOutputSchema = z.object({
    userId: z.string(),
    research: z.string(),
});

export const GetResearchInputSchema = z.object({    
    userId: z.string(),
    researchId: z.string(),
});

export type RequestDeepResearchOutput = z.infer<typeof RequestDeepResearchOutputSchema>;
export type RequestDeepResearchInput = z.infer<typeof RequestDeepResearchInputSchema>;
export type GetResearchInput = z.infer<typeof GetResearchInputSchema>;

