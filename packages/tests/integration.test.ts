import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from 'vitest';
import { getAllResearch, getResearchById, postResearch } from '../frontend/src/services/api';
import { RequestResearchInput } from '../metadata/agents/research-agent.schema';

// Mock the sst module for integration tests
vi.mock('sst', () => ({
  Resource: {
    BackendApi: {
      url: 'https://api.test.com'
    }
  }
}));

describe('API Integration Tests', () => {
  const mockResearchId = 'research-1';
  const mockResearchData = {
    researchId: 'research-1',
    title: 'Research Title',
    content: 'Research content goes here',
    createdAt: new Date().toISOString()
  };
  
  const mockResearchList = [
    {
      researchId: 'research-1',
      title: 'Research Title 1',
      content: 'Research content 1',
      createdAt: new Date().toISOString()
    },
    {
      researchId: 'research-2',
      title: 'Research Title 2',
      content: 'Research content 2',
      createdAt: new Date().toISOString()
    }
  ];
  
  const mockRequestInput: RequestResearchInput = {
    prompt: 'Research prompt goes here'
  };

  // Mock fetch implementation for integration tests
  beforeEach(() => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation((url, options) => {
      // Simulate different responses based on URL and method
      if (url.includes(`/research/${mockResearchId}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResearchData)
        });
      } else if (url.includes('/research/non-existent-id')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        });
      } else if (url.includes('/research') && options?.method === 'GET') {
        return Promise.resolve({
          json: () => Promise.resolve(mockResearchList)
        });
      } else if (url.includes('/research') && options?.method === 'POST') {
        const body = JSON.parse(options.body as string);
        if (!body.prompt) {
          return Promise.resolve({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            text: () => Promise.resolve('Invalid input')
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResearchData)
        });
      }
      
      // Default fallback
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getResearchById', () => {
    it('should call fetch with correct URL and method', async () => {
      const result = await getResearchById(mockResearchId);
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/research/${mockResearchId}`),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockResearchData);
    });

    it('should handle API call failures appropriately', async () => {
      const result = await getResearchById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getAllResearch', () => {
    it('should retrieve research data', async () => {
      const result = await getAllResearch();
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/research'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockResearchList);
    });
  });

  describe('postResearch', () => {
    it('should create new research and return data', async () => {
      const result = await postResearch(mockRequestInput);
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/research'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(mockRequestInput)
        })
      );
      expect(result).toEqual(mockResearchData);
    });

    it('should handle API call failures appropriately', async () => {
      const invalidInput: RequestResearchInput = {
        prompt: ''
      };
      
      await expect(postResearch(invalidInput)).rejects.toThrow();
    });
  });
});
