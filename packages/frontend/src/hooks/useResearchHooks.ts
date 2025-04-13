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
    refetchInterval: 30000, // Refetch every 30 seconds to check for status updates
  });
}

/**
 * Hook for fetching a specific research by ID
 */
export function useGetResearchById(researchId?: string, polling = false) {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['research', researchId],
    queryFn: async () => {
      if (!researchId) {
        return null;
      }

      const token = await getAuthToken();
      const response = await getResearchById(researchId, token || undefined);
      
      // Return null for not found
      if (!response) {
        return null;
      }
      
      return response as RequestResearchOutput;
    },
    // Enable polling if requested and the status is pending
    refetchInterval: (query) => {
      const data = query.state.data as RequestResearchOutput | null;
      if (polling && data && data.researchStatus === ResearchStatus.PENDING) {
        return 30000; // Poll every 30 seconds if status is pending
      }
      return false; // No polling if completed or failed
    },
    enabled: !!researchId,
  });
} 