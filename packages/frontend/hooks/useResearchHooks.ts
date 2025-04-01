'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { ResearchRequest } from '@metadata/api.schema';
import { getAllResearch, getResearchById, postResearch } from '../services/api.service';

/**
 * Hook for generating research
 */
export function useRequestResearch() {
  return useMutation({
    mutationFn: async (request: ResearchRequest) => {
      return await postResearch(request);
    },
  });
}

/**
 * Hook for fetching all research
 */
export function useGetAllResearch() {
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
export function useGetResearchById(researchId?: string) {
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