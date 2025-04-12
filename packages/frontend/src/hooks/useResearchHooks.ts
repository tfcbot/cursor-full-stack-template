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
      // Ensure we're working with an array, even if the API returns unexpected data
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        // If the API returns { data: [] }
        return response.data;
      } else {
        // If the API returns something unexpected, return an empty array
        console.error('Unexpected response from getAllResearch:', response);
        return [];
      }
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
      if (response && typeof response === 'object') {
        // If the API returns the data directly
        if ('researchId' in response) {
          return response as RequestResearchOutput;
        }
        // If the API returns { data: { ... } }
        else if (response.data && typeof response.data === 'object' && 'researchId' in response.data) {
          return response.data as RequestResearchOutput;
        }
      }
      return null;
    },
    enabled: !!researchId,
  });
} 