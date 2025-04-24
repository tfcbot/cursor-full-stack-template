import OpenAI from "openai";
import { citationsSchema, 
  RequestAgentTaskInput, 
  RequestAgentTaskOutput, 
  RequestAgentTaskOutputSchema,
  systemPrompt, userPromt } from "@metadata/agents/agent.schema";
import { Resource } from "sst";
import { withRetry } from "@utils/tools/retry";
import { zodToOpenAIFormat } from "@utils/vendors/openai/schema-helpers";

const client = new OpenAI({
  apiKey: Resource.OpenAiApiKey.value
});

export const executeAgentTask = async (input: RequestAgentTaskInput): Promise<RequestAgentTaskOutput> => {
  try {
    // Construct the prompt
    const response = await client.responses.create({
      model: "gpt-4o",
      tools: [{
        type: "web_search_preview", 
        search_context_size: "high",
      }],
      instructions: systemPrompt,
      input: [
        {"role": "user", "content": userPromt(input)}
      ],
      tool_choice: "required"
    });
    
    const deepOutput = await client.responses.create({
      model: "gpt-4o",
      tools: [{
        type: "web_search_preview", 
        search_context_size: "high",
      }],
      instructions: systemPrompt,
      input: [
        {"role": "user", "content": `Deep analysis on the following topic: ${response.output_text}`}
      ],
      tool_choice: "required"
    });
    
    const title = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {"role": "user", "content": `Generate a title for the following content: ${deepOutput.output_text}`}
      ],
    });

    const extractCitations = await client.responses.create({
      model: "gpt-4o",
      input: [
        {"role": "user", "content": `Extract the citations from the following content: ${response.output_text}`}
      ],
      text: zodToOpenAIFormat(citationsSchema, "citation_links")
    });

    const summary = await client.responses.create({
      model: "gpt-4.5-preview",
      input: [
        {"role": "user", "content": `Generate a summary for the following content: ${deepOutput.output_text}`}
      ],
    });

    const citations = citationsSchema.parse(JSON.parse(extractCitations.output_text));
    
    const content = RequestAgentTaskOutputSchema.parse({
      taskId: input.id,
      title: title.output_text,
      content: summary.output_text,
      citation_links: citations.links
    });
    
    return content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

// Keep the existing retry wrapper
export const runAgentTask = withRetry(executeAgentTask, { 
  retries: 3, 
  delay: 1000, 
  onRetry: (error: Error) => console.warn('Retrying content generation due to error:', error) 
});

// For backward compatibility
export const executeResearch = executeAgentTask;
export const runResearch = runAgentTask;
