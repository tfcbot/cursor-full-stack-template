/**
 * OpenAI Adapter
 * 
 * This module provides an adapter for interacting with the OpenAI API.
 * It handles task generation using OpenAI's models.
 */

import OpenAI from "openai";
import { RequestTaskInput, RequestTaskOutput, TaskStatus } from "@metadata/agents/agent.schema";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Run a task using OpenAI
 * 
 * @param input - The task request input
 * @returns The task output
 */
export const runTask = async (input: RequestTaskInput): Promise<RequestTaskOutput> => {
  try {
    console.info("Running task with OpenAI");
    
    // Create a system prompt for the task
    const systemPrompt = `You are a helpful assistant that provides comprehensive, accurate, and well-structured information on any topic. 
    Your response should be thorough, factual, and organized with clear sections where appropriate.
    Include relevant details, examples, and context to fully address the user's query.
    If you use external information, provide citation links at the end of your response.`;
    
    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input.prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    // Extract content from the response
    const content = completion.choices[0]?.message?.content || "No content generated";
    
    // Generate a title based on the prompt
    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "Generate a concise, informative title (5-10 words) for the following content. Return only the title text with no additional formatting or explanation." 
        },
        { role: "user", content: content.substring(0, 500) }
      ],
      temperature: 0.7,
      max_tokens: 20,
    });
    
    const title = titleCompletion.choices[0]?.message?.content || `Task for: ${input.prompt.substring(0, 50)}...`;
    
    // Extract citation links if present
    const citationRegex = /https?:\/\/[^\s]+/g;
    const citation_links = content.match(citationRegex) || [];
    
    // Create the task output
    return {
      agentId: input.id || "",
      userId: input.userId,
      title,
      content,
      citation_links,
      taskStatus: TaskStatus.COMPLETED,
      summary: content.substring(0, 200) + "..."
    };
  } catch (error) {
    console.error("Error running task with OpenAI:", error);
    throw new Error("Failed to run task with OpenAI");
  }
};
