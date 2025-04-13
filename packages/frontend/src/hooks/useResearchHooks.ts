'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { RequestResearchInput, RequestResearchOutput } from '@metadata/agents/research-agent.schema';
import { getAllResearch, getResearchById, postResearch } from '../services/api';
import { useAuth } from './useAuth';

/**
 * Hook for generating research
 */
export function useRequestResearch() {
  const { getAuthToken } = useAuth();

  return useMutation({
    mutationFn: async (request: RequestResearchInput) => {
      const token = await getAuthToken();
      return await postResearch(request, token || undefined);
    },
  });
}

/**
 * Hook for fetching all research
 */
export function useGetAllResearch() {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['allResearch'],
    queryFn: async () => {
      const token = await getAuthToken();
      const response = await getAllResearch(token || undefined);
      return response;
    },
  });
}

/**
 * Hook for fetching a specific research by ID
 */
export function useGetResearchById(researchId?: string) {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['research', researchId],
    queryFn: async () => {
      if (!researchId) {
        return null;
      }

      const token = await getAuthToken();
      const response = await getResearchById(researchId, token || undefined);
      // Handle both direct response and response.data patterns
      return response as RequestResearchOutput;
    },
    enabled: !!researchId,
  });
} 