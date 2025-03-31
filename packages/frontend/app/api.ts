'use client';

// Types only - no implementation
// The actual implementation is in hooks/useDeepResearchHooks.ts

export interface DeepResearchRequest {
  prompt: string;
}

export interface DeepResearch {
  researchId: string;
  status: string;
  [key: string]: any;
}

// Re-export hooks from dedicated hook files
export { 
  useGenerateDeepResearch, 
  useAllDeepResearch as useGetAllDeepResearch, 
  useDeepResearchById as useGetDeepResearch 
} from '../hooks/useDeepResearchHooks'; 