'use client';

import { DeepResearch, DeepResearchRequest } from '../app/api';
import { MOCK_DEEP_RESEARCH } from './mockData';
import { apiService } from './agent.service';

const STORAGE_KEY = 'deep-research-generator-data';

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
      storage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DEEP_RESEARCH));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all deep research items from local storage
export const getAllDeepResearch = async (): Promise<DeepResearch[]> => {
  // First try to fetch from API
  try {
    const response = await apiService.getDeepResearch();
    if (response && Array.isArray(response)) {
      return response;
    }
  } catch (error) {
    console.warn('Could not fetch deep research from API, falling back to local storage', error);
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
    console.error('Error getting deep research from storage:', error);
    return [];
  }
};

// Get a specific deep research item by ID
export const getDeepResearchById = async (id: string): Promise<DeepResearch | null> => {
  // Try to get all deep research (may come from API or local storage)
  const allDeepResearch = await getAllDeepResearch();
  return allDeepResearch.find(item => item.id === id) || null;
};

// Add a new deep research item
export const addDeepResearch = async (request: DeepResearchRequest): Promise<DeepResearch> => {
  // First try to use the API
  try {
    const newDeepResearch: DeepResearch = {
      id: Math.random().toString(36).substring(2, 15),
      topic: request.topic,
      content: generateMockDeepResearch(request),
      createdAt: new Date().toISOString(),
    };
    
    // Try to post to API
    const response = await apiService.postDeepResearch(JSON.stringify(newDeepResearch));
    
    if (response && response.id) {
      return response;
    }
  } catch (error) {
    console.warn('Could not post deep research to API, falling back to local storage', error);
    // Fall back to local storage if API fails
  }
  
  // Local storage fallback
  const storage = getStorage();
  if (!storage) throw new Error('Storage not available');
  
  try {
    // Generate a new deep research item
    const newDeepResearch: DeepResearch = {
      id: Math.random().toString(36).substring(2, 15),
      topic: request.topic,
      content: generateMockDeepResearch(request),
      createdAt: new Date().toISOString(),
    };
    
    // Get existing deep research
    const existingDeepResearch = await getAllDeepResearch();
    
    // Add new deep research to the list
    const updatedDeepResearch = [newDeepResearch, ...existingDeepResearch];
    
    // Save back to storage
    storage.setItem(STORAGE_KEY, JSON.stringify(updatedDeepResearch));
    
    return newDeepResearch;
  } catch (error) {
    console.error('Error adding deep research to storage:', error);
    throw new Error('Failed to save deep research');
  }
};

// Helper function to generate mock deep research (in a real app, this would be an API call)
function generateMockDeepResearch(request: DeepResearchRequest): string {
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
  
  paragraphs.push(`This is a ${request.length} in-depth research about "${request.topic}" written in a ${toneMap[request.tone]} tone.`);
  
  for (let i = 1; i < paragraphCount; i++) {
    paragraphs.push(`Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. ${request.topic} is a fascinating subject that can be thoroughly researched from multiple perspectives.`);
  }
  
  paragraphs.push(`In conclusion, ${request.topic} is a complex area worthy of deep exploration. This research aimed to provide a ${request.length} comprehensive analysis in a ${request.tone} style.`);
  
  return paragraphs.join('\n\n');
} 