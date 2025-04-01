import OpenAI from "openai";
import { RequestResearchInput, RequestResearchOutput, RequestResearchOutputSchema, systemPrompt, userPromt } from "@metadata/agents/research-agent.schema";
import { Resource } from "sst";
import { withRetry } from "@utils/tools/retry";
import { zodToOpenAIFormat } from "@utils/vendors/openai/schema-helpers";

const client = new OpenAI({
  apiKey: Resource.OpenAiApiKey.value
});

export const createContent = async (input: RequestResearchInput): Promise<RequestResearchOutput> => {
  try {
    // Construct the prompt
   
    const response = await client.responses.create({
      model: "gpt-4.5-preview",
      tools: [{
        type: "web_search_preview"
      }],
      instructions: systemPrompt,
      input: [
        {"role": "user", "content": userPromt(input)}
      ],
      text: zodToOpenAIFormat(RequestResearchOutputSchema, "content")
    });
    
    // Parse the response and validate against the schema
    const parsedResponse = JSON.parse(response.output_text);
    
    const content = RequestResearchOutputSchema.parse(parsedResponse);
    
    return content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

// Keep the existing retry wrapper
export const runContent = withRetry(createContent, { 
  retries: 3, 
  delay: 1000, 
  onRetry: (error: Error) => console.warn('Retrying content generation due to error:', error) 
});
