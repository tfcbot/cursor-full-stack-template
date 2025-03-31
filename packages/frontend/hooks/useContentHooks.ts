'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Content, ContentRequest } from '../app/api';
import { addContent, getAllContent, getContentById } from '../services/contentService';

/**
 * Hook for generating content
 */
export function useGenerateContent() {
  return useMutation({
    mutationFn: async (request: ContentRequest) => {
      return await addContent(request);
    },
  });
}

/**
 * Hook for fetching all content
 */
export function useAllContent() {
  return useQuery({
    queryKey: ['allContent'],
    queryFn: async () => {
      return await getAllContent();
    },
  });
}

/**
 * Hook for fetching a specific content by ID
 */
export function useContentById(contentId?: string) {
  return useQuery({
    queryKey: ['content', contentId],
    queryFn: async () => {
      if (!contentId) {
        return null;
      }
      
      return await getContentById(contentId);
    },
    enabled: !!contentId,
  });
} 