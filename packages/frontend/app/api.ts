'use client';

// Types only - no implementation
// The actual implementation is in hooks/useContentHooks.ts

export interface ContentRequest {
  topic: string;
  length: 'short' | 'medium' | 'long';
  tone: 'casual' | 'professional' | 'humorous';
}

export interface Content {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
}

// Re-export hooks from dedicated hook files
export { 
  useGenerateContent, 
  useAllContent as useGetAllContent, 
  useContentById as useGetContent 
} from '../hooks/useContentHooks'; 