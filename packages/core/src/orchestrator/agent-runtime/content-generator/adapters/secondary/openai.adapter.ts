import OpenAI from "openai";
import { ContentRequestInput ,userPromt, ContentRequestOutputSchema, ContentRequestOutput, systemPromptSchema } from "@metadata/agents/content-agent.schema";
import { Resource } from "sst";
import { withRetry } from "@utils/tools/retry";
import { zodToOpenAIFormat } from "@utils/vendors/openai/schema-helpers";

const client = new OpenAI({
  apiKey: Resource.OpenAIApiKey.value
});

export const createContent = async (input: ContentRequestInput): Promise<ContentRequestOutput> => {
  try {
    // Construct the prompt
   
    const response = await client.responses.create({
      model: "gpt-4.5-preview",
      tools: [{
        type: "web_search_preview"
      }],
      instructions: systemPromptSchema,
      input: [
        {"role": "user", "content": userPromt(input)}
      ],
      text: zodToOpenAIFormat(ContentRequestOutputSchema, "content")
    });
    
    // Parse the response and validate against the schema
    const parsedResponse = JSON.parse(response.output_text);
    
    const content = ContentRequestOutputSchema.parse(parsedResponse);
    
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
