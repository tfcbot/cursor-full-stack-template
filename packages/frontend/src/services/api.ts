

import { RequestResearchInput, RequestResearchOutput } from "@metadata/agents/research-agent.schema";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

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

export const getHeaders = async (token?: string): Promise<HeadersInit> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.defaultHeaders,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const getAllResearch = async (token?: string): Promise<RequestResearchOutput[]> => {
  const absoluteUrl = await getAbsoluteUrl('/research');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
      headers: await getHeaders(token),
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

export const getResearchById = async (researchId: string, token?: string): Promise<RequestResearchOutput | null> => {
  const absoluteUrl = await getAbsoluteUrl(`/research/${researchId}`);
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
      headers: await getHeaders(token),
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

export const postResearch = async (requestData: RequestResearchInput, token?: string): Promise<RequestResearchOutput> => {
  const absoluteUrl = await getAbsoluteUrl('/research');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'POST',
      headers: await getHeaders(token),
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



