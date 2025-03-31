'use server';

import { Resource } from "sst";

// Instead of importing from SST, we'll use environment variables
// const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_URL = Resource.BackendApi.url; // For simplicity, hardcode to /api for now

const API_CONFIG = {
  baseUrl: API_URL,
  version: '',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};


export interface DeepResearchRequest {
  prompt: string;
  researchId?: string;
}

export interface DeepResearchResponse {
  researchId: string;
  status: string;
  [key: string]: any;
}



export const getAbsoluteUrl = async (path: string): Promise<string> => {
  return `${API_CONFIG.baseUrl}${path}`;
};

export const getHeaders = async (): Promise<HeadersInit> => {
  return {
    ...API_CONFIG.defaultHeaders,
  };
};

export const getDeepResearch = async (): Promise<DeepResearchResponse[]> => {
  const absoluteUrl = await getAbsoluteUrl('/deep-research');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch deep research: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching deep research:', error);
    return [];
  }
}

export const postDeepResearch = async (requestData: DeepResearchRequest): Promise<DeepResearchResponse> => {
  const absoluteUrl = await getAbsoluteUrl('/deep-research');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to post deep research: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error posting deep research:', error);
    throw error;
  }
}



