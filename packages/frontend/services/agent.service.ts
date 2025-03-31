'use client';

// Instead of importing from SST, we'll use environment variables
// const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_URL = '/api'; // For simplicity, hardcode to /api for now

const API_CONFIG = {
  baseUrl: API_URL,
  version: '',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};

export interface IApiService {
  getAbsoluteUrl(path: string): string;
  getHeaders(): HeadersInit;
}

export class ApiService implements IApiService {
  
  getAbsoluteUrl(path: string): string {
    return `${API_CONFIG.baseUrl}${path}`;
  };
  
  getHeaders(): HeadersInit {
    return {
      ...API_CONFIG.defaultHeaders,
    };
  };
  
  async getContent(): Promise<any> {
    const absoluteUrl = this.getAbsoluteUrl('/content');
    try {
      const response = await fetch(absoluteUrl, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  }

  async postContent(content: string): Promise<any> {
    const absoluteUrl = this.getAbsoluteUrl('/content');
    try {
      const response = await fetch(absoluteUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: content,
      });
      if (!response.ok) {
        throw new Error('Failed to post content');
      }
      return response.json();
    } catch (error) {
      console.error('Error posting content:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
