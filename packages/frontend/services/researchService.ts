'use client';

import { DeepResearch, DeepResearchRequest } from '../app/api';
import { MOCK_DEEP_RESEARCH } from './mockData';
import { getDeepResearch, postDeepResearch } from './agent.service';

const STORAGE_KEY = 'research-agent-data';

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

// Get all research items from local storage
export const getAllResearch = async (): Promise<DeepResearch[]> => {
  // First try to fetch from API
  try {
    const response = await getDeepResearch();
    if (response && Array.isArray(response)) {
      return response;
    }
  } catch (error) {
    console.warn('Could not fetch research from API, falling back to local storage', error);
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
    console.error('Error getting research from storage:', error);
    return [];
  }
};

// Get a specific research item by ID
export const getResearchById = async (id: string): Promise<DeepResearch | null> => {
  // Try to get all research (may come from API or local storage)
  const allResearch = await getAllResearch();
  return allResearch.find(item => item.id === id) || null;
};

// Add a new research item
export const addResearch = async (request: DeepResearchRequest): Promise<DeepResearch> => {
  // First try to use the API
  try {
    const newResearch: DeepResearchRequest = {
      prompt: generateMockResearch(request),
    };
    
    // Try to post to API
    const response = await postDeepResearch(newResearch);
    
    if (response && response.id) {
      return response;
    }
  } catch (error) {
    console.warn('Could not post research to API, falling back to local storage', error);
    // Fall back to local storage if API fails
  }
  
  // Local storage fallback
  const storage = getStorage();
  if (!storage) throw new Error('Storage not available');
  
  try {
    // Generate a new research item
    const newResearch: DeepResearch = {
      researchId: Math.random().toString(36).substring(2, 15),
      status: 'pending',
      prompt: generateMockResearch(request),
      createdAt: new Date().toISOString(),
    };
    
    // Get existing research
    const existingResearch = await getAllResearch();
    
    // Add new research to the list
    const updatedResearch = [newResearch, ...existingResearch];
    
    // Save back to storage
    storage.setItem(STORAGE_KEY, JSON.stringify(updatedResearch));
    
    return newResearch;
  } catch (error) {
    console.error('Error adding research to storage:', error);
    throw new Error('Failed to save research');
  }
};

// Helper function to generate mock research (in a real app, this would be an API call)
function generateMockResearch(request: DeepResearchRequest): string {
  // Extract the prompt from the request
  const prompt = request.prompt;
  
  // Default values
  const defaultTone = 'professional';
  const defaultLength = 'medium';
  
  // Define tone descriptions
  const toneMap: Record<string, string> = {
    casual: 'friendly and conversational',
    professional: 'formal and informative',
    humorous: 'light-hearted and funny',
  };
  
  // Generate paragraphs
  const paragraphs = [];
  const paragraphCount = 10;
  
  // Introduction paragraph
  paragraphs.push(`This is a comprehensive research about "${prompt}" written in a ${toneMap[defaultTone]} tone.`);
  
  // Body paragraphs
  for (let i = 1; i < paragraphCount; i++) {
    paragraphs.push(`Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. ${prompt} is a fascinating subject that can be thoroughly researched from multiple perspectives.`);
  }
  
  // Conclusion paragraph
  paragraphs.push(`In conclusion, ${prompt} is a complex area worthy of exploration. This research aimed to provide a comprehensive analysis in a ${defaultTone} style.`);
  
  return paragraphs.join('\n\n');
} 