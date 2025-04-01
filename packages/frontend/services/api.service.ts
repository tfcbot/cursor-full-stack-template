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
  const response = await fetch(absoluteUrl, {
    method: 'GET',
  });
  return response.json();
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



