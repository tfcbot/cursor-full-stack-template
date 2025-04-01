'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { DeepResearch, DeepResearchRequest } from '../app/api';
import { addResearch, getAllResearch, getResearchById } from '../services/researchService';

/**
 * Hook for generating research
 */
export function useGenerateResearch() {
  return useMutation({
    mutationFn: async (request: DeepResearchRequest) => {
      return await addResearch(request);
    },
  });
}

/**
 * Hook for fetching all research
 */
export function useAllResearch() {
  return useQuery({
    queryKey: ['allResearch'],
    queryFn: async () => {
      return await getAllResearch();
    },
  });
}

/**
 * Hook for fetching a specific research by ID
 */
export function useResearchById(researchId?: string) {
  return useQuery({
    queryKey: ['research', researchId],
    queryFn: async () => {
      if (!researchId) {
        return null;
      }
      
      return await getResearchById(researchId);
    },
    enabled: !!researchId,
  });
} 