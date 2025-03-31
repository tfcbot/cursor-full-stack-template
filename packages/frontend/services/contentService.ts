'use client';

import { Content, ContentRequest } from '../app/api';
import { MOCK_CONTENT } from './mockData';
import { apiService } from './agent.service';

const STORAGE_KEY = 'content-generator-data';

// Helper to safely interact with localStorage (only on client)
const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage;
};

// Initialize storage with mock data if empty
const initializeStorage = () => {
  const storage = getStorage();
  if (!storage) return;
  
  try {
    const existing = storage.getItem(STORAGE_KEY);
    if (!existing) {
      storage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CONTENT));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all content items from local storage
export const getAllContent = async (): Promise<Content[]> => {
  // First try to fetch from API
  try {
    const response = await apiService.getContent();
    if (response && Array.isArray(response)) {
      return response;
    }
  } catch (error) {
    console.warn('Could not fetch content from API, falling back to local storage', error);
    // Fall back to local storage if API fails
  }
  
  // Local storage fallback
  const storage = getStorage();
  if (!storage) return [];
  
  // Initialize with mock data if empty
  initializeStorage();
  
  try {
    const data = storage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting content from storage:', error);
    return [];
  }
};

// Get a specific content item by ID
export const getContentById = async (id: string): Promise<Content | null> => {
  // Try to get all content (may come from API or local storage)
  const allContent = await getAllContent();
  return allContent.find(item => item.id === id) || null;
};

// Add a new content item
export const addContent = async (request: ContentRequest): Promise<Content> => {
  // First try to use the API
  try {
    const newContent: Content = {
      id: Math.random().toString(36).substring(2, 15),
      topic: request.topic,
      content: generateMockContent(request),
      createdAt: new Date().toISOString(),
    };
    
    // Try to post to API
    const response = await apiService.postContent(JSON.stringify(newContent));
    
    if (response && response.id) {
      return response;
    }
  } catch (error) {
    console.warn('Could not post content to API, falling back to local storage', error);
    // Fall back to local storage if API fails
  }
  
  // Local storage fallback
  const storage = getStorage();
  if (!storage) throw new Error('Storage not available');
  
  try {
    // Generate a new content item
    const newContent: Content = {
      id: Math.random().toString(36).substring(2, 15),
      topic: request.topic,
      content: generateMockContent(request),
      createdAt: new Date().toISOString(),
    };
    
    // Get existing content
    const existingContent = await getAllContent();
    
    // Add new content to the list
    const updatedContent = [newContent, ...existingContent];
    
    // Save back to storage
    storage.setItem(STORAGE_KEY, JSON.stringify(updatedContent));
    
    return newContent;
  } catch (error) {
    console.error('Error adding content to storage:', error);
    throw new Error('Failed to save content');
  }
};

// Helper function to generate mock content (in a real app, this would be an API call)
function generateMockContent(request: ContentRequest): string {
  const lengthMap = {
    short: 2,
    medium: 4,
    long: 8,
  };
  
  const toneMap = {
    casual: 'friendly and conversational',
    professional: 'formal and informative',
    humorous: 'light-hearted and funny',
  };
  
  const paragraphs = [];
  const paragraphCount = lengthMap[request.length];
  
  paragraphs.push(`This is a ${request.length} article about "${request.topic}" written in a ${toneMap[request.tone]} tone.`);
  
  for (let i = 1; i < paragraphCount; i++) {
    paragraphs.push(`Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. ${request.topic} is an interesting subject that can be explored from many angles.`);
  }
  
  paragraphs.push(`In conclusion, ${request.topic} is a fascinating area worth exploring further. This article aimed to provide a ${request.length} overview in a ${request.tone} style.`);
  
  return paragraphs.join('\n\n');
} 