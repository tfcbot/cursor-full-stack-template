'use server';

import { RequestResearchInput, RequestResearchOutput } from "@metadata/agents/research-agent.schema";
import { Resource } from "sst";

const API_URL = Resource.BackendApi.url;

const API_CONFIG = {
  baseUrl: API_URL,
  version: '',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};


export const getAbsoluteUrl = async (path: string): Promise<string> => {
  return `${API_CONFIG.baseUrl}${path}`;
};

export const getHeaders = async (): Promise<HeadersInit> => {
  
  return {
    ...API_CONFIG.defaultHeaders,
  };
};

export const getAllResearch = async (): Promise<RequestResearchOutput[]> => {
  const absoluteUrl = await getAbsoluteUrl('/research');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch research: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        return data.data;
      } else if (data.body && Array.isArray(data.body)) {
        return data.body;
      }
    }
    
    // If we reach here, the response format was unexpected
    console.error('Unexpected response format from getAllResearch:', data);
    return [];
  } catch (error) {
    console.error('Error fetching all research:', error);
    return [];
  }
}

export const getResearchById = async (researchId: string): Promise<RequestResearchOutput | null> => {
  const absoluteUrl = await getAbsoluteUrl(`/research/${researchId}`);
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch deep research: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching research:', error);
    return null;
  }
}

export const postResearch = async (requestData: RequestResearchInput): Promise<RequestResearchOutput> => {
  const absoluteUrl = await getAbsoluteUrl('/research');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to post research: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error posting research:', error);
    throw error;
  }
}



