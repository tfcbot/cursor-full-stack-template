'use server';

import { Resource } from "sst";
import { parseApiResponse, UserCreditsResponseSchema } from "@metadata/api-response.schema";

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

export const getHeaders = async (token: string): Promise<HeadersInit> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.defaultHeaders,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const getUserCredits = async (token: string): Promise<number> => {
  const absoluteUrl = await getAbsoluteUrl('/credits');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
      headers: await getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch credits: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Use the shared schema parser which handles both unwrapped and wrapped responses
    const parsedData = parseApiResponse(responseData, UserCreditsResponseSchema);
    return parsedData.credits;
  } catch (error) {
    console.error('Error fetching credits:', error);
    return 0;
  }
}

export const initiateCheckout = async (token: string): Promise<{ url: string }> => {
  const absoluteUrl = await getAbsoluteUrl('/checkout');
  try {
    const response = await fetch(absoluteUrl, {
      method: 'POST',
      headers: await getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to initiate checkout: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Parse with the schema if you've defined a CheckoutResponseSchema
    // const parsedData = parseApiResponse(data, CheckoutResponseSchema);
    // return parsedData;
    
    // For now, keep the existing logic
    if (typeof data.url === 'string') {
      return { url: data.url };
    }
    
    // If we reach here, the response format was unexpected
    console.error('Unexpected response format from initiateCheckout:', data);
    throw new Error('Invalid checkout response format');
  } catch (error) {
    console.error('Error initiating checkout:', error);
    throw error;
  }
} 