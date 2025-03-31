'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { DeepResearch, DeepResearchRequest } from '../app/api';
import { addDeepResearch, getAllDeepResearch, getDeepResearchById } from '../services/deepResearchService';

/**
 * Hook for generating deep research
 */
export function useGenerateDeepResearch() {
  return useMutation({
    mutationFn: async (request: DeepResearchRequest) => {
      return await addDeepResearch(request);
    },
  });
}

/**
 * Hook for fetching all deep research
 */
export function useAllDeepResearch() {
  return useQuery({
    queryKey: ['allDeepResearch'],
    queryFn: async () => {
      return await getAllDeepResearch();
    },
  });
}

/**
 * Hook for fetching a specific deep research by ID
 */
export function useDeepResearchById(deepResearchId?: string) {
  return useQuery({
    queryKey: ['deepResearch', deepResearchId],
    queryFn: async () => {
      if (!deepResearchId) {
        return null;
      }
      
      return await getDeepResearchById(deepResearchId);
    },
    enabled: !!deepResearchId,
  });
} 