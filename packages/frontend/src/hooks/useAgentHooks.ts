'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequestTaskFormInput, RequestTaskOutput, TaskStatus } from '@metadata/agents/agent.schema';
import { getAllTasks, getTaskById, postTask } from '../services/api';
import { useAuth } from './useAuth';

/**
 * Hook for generating task
 */
export function useRequestTask() {
  const { getAuthToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RequestTaskFormInput) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }
      return await postTask(request, token);
    },
    onSuccess: (data) => {
      // Add the new task to the cache immediately for optimistic updates
      if (data && data.agentId) {
        // Update the specific task query
        queryClient.setQueryData(['task', data.agentId], data);
        
        // Update the all tasks list if it exists in the cache
        const allTasks = queryClient.getQueryData<RequestTaskOutput[]>(['allTasks']);
        if (allTasks) {
          queryClient.setQueryData(['allTasks'], [data, ...allTasks]);
        }
      }
    }
  });
}

/**
 * Hook for fetching all tasks
 */
export function useGetAllTasks() {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['allTasks'],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) {
        return null;
      }
      const response = await getAllTasks(token);
      return response;
    },
  });
}

/**
 * Hook for fetching a specific task by ID
 */
export function useGetTaskById(agentId?: string) {
  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: ['task', agentId],
    queryFn: async () => {
      if (!agentId) {
        return null;
      }

      const token = await getAuthToken();
      
      // Add a cache-busting parameter to ensure we don't get cached responses
      const timestamp = new Date().getTime();
      console.log(`Fetching task ${agentId} at ${timestamp}`);
      
      const response = await getTaskById(agentId, token || undefined);
      
      // Return null for not found
      if (!response) {
        return null;
      }
      
      return response as RequestTaskOutput;
    },
    // Add conditional polling for pending task
    refetchInterval: (query) => {
      const data = query.state.data as RequestTaskOutput | null;
      
      if (data?.taskStatus === TaskStatus.PENDING) {
        return 5000; // Poll every 5 seconds if pending
      }
      
      return false; // No polling for completed task
    },
    enabled: !!agentId,
  });
}
