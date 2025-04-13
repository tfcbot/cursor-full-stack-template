import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

export enum ResearchStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed"
} 



export const RequestResearchInputSchema = z.object({
    prompt: z.string(),
    id: z.string().optional().default(uuidv4()),
    userId: z.string().optional(),
});

export const systemPrompt = `
You are a research agent.

You are responsible for creating detailed research for a given topic.

You will be given a prompt and you will need to create comprehensive research according to the prompt.

Search the web for relevant information and use it to create the research.

You will need to provide a list of citations for the research.

The citations should be in the format of a list of URLs.
`

export const userPromt = (input: RequestResearchInput): string  => `
Generate research according to the following prompt:

${input.prompt}
`

export const RequestResearchOutputSchema = z.object({
    researchId: z.string(),
    title: z.string(), 
    content: z.string(),
    citation_links: z.array(z.string()),
    researchStatus: z.nativeEnum(ResearchStatus).default(ResearchStatus.PENDING),
    userId: z.string().optional(),
});

export const GetResearchInputSchema = z.object({    
    researchId: z.string(),
});

export const citationsSchema = z.object({
    links: z.array(z.string())
  });

export type RequestResearchOutput = z.infer<typeof RequestResearchOutputSchema>;
export type RequestResearchInput = z.infer<typeof RequestResearchInputSchema>;
export type GetResearchInput = z.infer<typeof GetResearchInputSchema>; 