import { RequestResearchInputSchema, RequestResearchOutputSchema } from '@metadata/agents/research-agent.schema';
import { describe, expect, test } from 'bun:test';

describe('Research Agent Schema Validation', () => {
  const validInput = {
    prompt: 'Explain the recent developments in large language models and their applications.'
  };

  const validOutput = {
    researchId: 'test-id-123',
    title: 'Recent Developments in LLMs',
    content: 'This is a research content about large language models and their applications. It contains information about recent advancements and use cases.',
    createdAt: new Date().toISOString()
  };

  test('should validate input against schema', () => {
    // Verify that the test input is valid according to the schema
    expect(() => RequestResearchInputSchema.parse(validInput)).not.toThrow();
  });

  test('should reject invalid input missing required fields', () => {
    // Test with empty object - should fail validation
    expect(() => RequestResearchInputSchema.parse({})).toThrow();
    
    // Test with null prompt - should fail validation
    expect(() => RequestResearchInputSchema.parse({ prompt: null })).toThrow();
    
    // Test with empty prompt - should still pass as it's a string
    expect(() => RequestResearchInputSchema.parse({ prompt: '' })).not.toThrow();
  });

  test('should validate output against schema', () => {
    // Verify that the test output is valid according to the schema
    expect(() => RequestResearchOutputSchema.parse(validOutput)).not.toThrow();
  });

  test('should reject invalid output missing required fields', () => {
    // Missing researchId
    expect(() => RequestResearchOutputSchema.parse({
      title: 'Test Title',
      content: 'Test Content',
      createdAt: new Date().toISOString()
    })).toThrow();
    
    // Missing title
    expect(() => RequestResearchOutputSchema.parse({
      researchId: 'test-id',
      content: 'Test Content',
      createdAt: new Date().toISOString()
    })).toThrow();
    
    // Missing content
    expect(() => RequestResearchOutputSchema.parse({
      researchId: 'test-id',
      title: 'Test Title',
      createdAt: new Date().toISOString()
    })).toThrow();
    
    // Missing createdAt
    expect(() => RequestResearchOutputSchema.parse({
      researchId: 'test-id',
      title: 'Test Title',
      content: 'Test Content'
    })).toThrow();
  });

  test('should require specific data types for each field', () => {
    // researchId must be string
    expect(() => RequestResearchOutputSchema.parse({
      ...validOutput,
      researchId: 123
    })).toThrow();
    
    // title must be string
    expect(() => RequestResearchOutputSchema.parse({
      ...validOutput,
      title: 123
    })).toThrow();
    
    // content must be string
    expect(() => RequestResearchOutputSchema.parse({
      ...validOutput,
      content: 123
    })).toThrow();
    
    // createdAt must be string
    expect(() => RequestResearchOutputSchema.parse({
      ...validOutput,
      createdAt: 123
    })).toThrow();
  });
}); 