'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequestAgentTaskFormInput, RequestAgentTaskOutput, AgentTaskStatus } from '@metadata/agents/agent.schema';
import { getAllResearch, getResearchById, postResearch } from '../services/api';
import { useAuth } from './useAuth';

/**
 * Hook for generating agent tasks
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
      if (data && data.taskId) {
        // Update the specific task query
        queryClient.setQueryData(['research', data.taskId], data);
        
        // Update the all tasks list if it exists in the cache
        const allTasks = queryClient.getQueryData<RequestAgentTaskOutput[]>(['allResearch']);
        if (allTasks) {
          queryClient.setQueryData(['allResearch'], [data, ...allTasks]);
        }
      }
    }
  });
}

/**
 * Hook for fetching all agent tasks
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
 * Hook for fetching a specific agent task by ID
 */
export function useGetResearchById(taskId?: string) {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['research', taskId],
    queryFn: async () => {
      if (!taskId) {
        return null;
      }

      const token = await getAuthToken();
      
      // Add a cache-busting parameter to ensure we don't get cached responses
      const timestamp = new Date().getTime();
      console.log(`Fetching task ${taskId} at ${timestamp}`);
      
      const response = await getResearchById(taskId, token || undefined);
      
      // Return null for not found
      if (!response) {
        return null;
      }
      
      return response as RequestAgentTaskOutput;
    },
    // Add conditional polling for pending tasks
    refetchInterval: (query) => {
      const data = query.state.data as RequestAgentTaskOutput | null;
      
      if (data?.taskStatus === AgentTaskStatus.PENDING) {
        return 5000; // Poll every 5 seconds if pending
      }
      
      return false; // No polling for completed tasks
    },
    enabled: !!taskId,
  });
}
