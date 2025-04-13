'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { RequestResearchInput, RequestResearchOutput, ResearchStatus } from '@metadata/agents/research-agent.schema';
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
      if (!token) {
        return null;
      }
      const response = await getAllResearch(token);
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
      
      // Add a cache-busting parameter to ensure we don't get cached responses
      const timestamp = new Date().getTime();
      console.log(`Fetching research ${researchId} at ${timestamp}`);
      
      const response = await getResearchById(researchId, token || undefined);
      
      // Return null for not found
      if (!response) {
        return null;
      }
      
      return response as RequestResearchOutput;
    },
    // Add conditional polling for pending research
    refetchInterval: (query) => {
      const data = query.state.data as RequestResearchOutput | null;
      
      if (data?.researchStatus === ResearchStatus.PENDING) {
        return 5000; // Poll every 5 seconds if pending
      }
      
      return false; // No polling for completed research
    },
    enabled: !!researchId,
  });
} 