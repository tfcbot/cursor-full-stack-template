'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequestAgentTaskFormInput, RequestAgentTaskOutput, AgentTaskStatus } from '@metadata/agents/agent.schema';
import { getAllResearch, getResearchById, postResearch } from '../services/api';
import { useAuth } from './useAuth';

/**
 * Hook for submitting a task
 */
export function useRequestResearch() {
  const { getAuthToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RequestAgentTaskFormInput) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }
      return await postResearch(request, token);
    },
    onSuccess: (data) => {
      // Add the new task to the cache immediately for optimistic updates
      const id = data?.taskId || data?.researchId;
      if (id) {
        // Update the specific task query
        queryClient.setQueryData(['task', id], data);
        queryClient.setQueryData(['research', id], data); // For backward compatibility
        
        // Update the all tasks list if it exists in the cache
        const allTasks = queryClient.getQueryData<RequestAgentTaskOutput[]>(['allTasks']);
        if (allTasks) {
          queryClient.setQueryData(['allTasks'], [data, ...allTasks]);
        }
        
        // For backward compatibility
        const allResearch = queryClient.getQueryData<RequestAgentTaskOutput[]>(['allResearch']);
        if (allResearch) {
          queryClient.setQueryData(['allResearch'], [data, ...allResearch]);
        }
      }
    }
  });
}

/**
 * Hook for fetching all tasks
 */
export function useGetAllResearch() {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['allTasks'],
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
 * Hook for fetching a specific task by ID
 */
export function useGetResearchById(id?: string) {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const token = await getAuthToken();
      
      // Add a cache-busting parameter to ensure we don't get cached responses
      const timestamp = new Date().getTime();
      console.log(`Fetching task ${id} at ${timestamp}`);
      
      const response = await getResearchById(id, token || undefined);
      
      // Return null for not found
      if (!response) {
        return null;
      }
      
      return response as RequestAgentTaskOutput;
    },
    // Add conditional polling for pending tasks
    refetchInterval: (query) => {
      const data = query.state.data as RequestAgentTaskOutput | null;
      
      // Check for both taskStatus and researchStatus (for backward compatibility)
      if (data?.taskStatus === AgentTaskStatus.PENDING || data?.researchStatus === 'pending') {
        return 5000; // Poll every 5 seconds if pending
      }
      
      return false; // No polling for completed tasks
    },
    enabled: !!id,
  });
}
