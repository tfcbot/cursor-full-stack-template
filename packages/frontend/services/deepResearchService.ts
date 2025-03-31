'use client';

import { DeepResearch, DeepResearchRequest } from '../app/api';
import { MOCK_DEEP_RESEARCH } from './mockData';
import { getDeepResearch, postDeepResearch } from './agent.service';

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
    const response = await getDeepResearch();
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
    const newDeepResearch: DeepResearchRequest = {
      prompt: generateMockDeepResearch(request),
    };
    
    // Try to post to API
    const response = await postDeepResearch(newDeepResearch);
    
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
      researchId: Math.random().toString(36).substring(2, 15),
      status: 'pending',
      prompt: generateMockDeepResearch(request),
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
  paragraphs.push(`This is an in-depth research about "${prompt}" written in a ${toneMap[defaultTone]} tone.`);
  
  // Body paragraphs
  for (let i = 1; i < paragraphCount; i++) {
    paragraphs.push(`Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. ${prompt} is a fascinating subject that can be thoroughly researched from multiple perspectives.`);
  }
  
  // Conclusion paragraph
  paragraphs.push(`In conclusion, ${prompt} is a complex area worthy of deep exploration. This research aimed to provide a comprehensive analysis in a ${defaultTone} style.`);
  
  return paragraphs.join('\n\n');
}