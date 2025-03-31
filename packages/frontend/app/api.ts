'use client';

// Types only - no implementation
// The actual implementation is in hooks/useDeepResearchHooks.ts

export interface DeepResearchRequest {
  topic: string;
  length: 'short' | 'medium' | 'long';
  tone: 'casual' | 'professional' | 'humorous';
}

export interface DeepResearch {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
}

// Re-export hooks from dedicated hook files
export { 
  useGenerateDeepResearch, 
  useAllDeepResearch as useGetAllDeepResearch, 
  useDeepResearchById as useGetDeepResearch 
} from '../hooks/useDeepResearchHooks'; 