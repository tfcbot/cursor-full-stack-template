'use client';

// Types only - no implementation
// The actual implementation is in hooks/useResearchHooks.ts

export interface ResearchRequest {
  prompt: string;
  length?: string;
  tone?: string;
}

export interface DeepResearchRequest {
  prompt: string;
}

export interface Research {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
}

export interface DeepResearch {
  researchId: string;
  status: string;
  [key: string]: any;
}

// Re-export hooks from dedicated hook files
export { 
  useGenerateResearch as useGenerateDeepResearch, 
  useAllResearch as useGetAllDeepResearch, 
  useResearchById as useGetDeepResearch 
} from '../hooks/useResearchHooks'; 