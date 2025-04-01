import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from 'vitest';
import { getAllResearch, getResearchById, postResearch } from '@services/api';
import { RequestResearchInput } from '@metadata/agents/research-agent.schema';

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

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getResearchById', () => {
    it('should fetch research by ID successfully', async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResearchData)
      });

      const result = await getResearchById(mockResearchId);
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/research/${mockResearchId}`),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockResearchData);
    });

    it('should return null when API call fails', async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await getResearchById(mockResearchId);
      
      expect(result).toBeNull();
    });
  });

  describe('getAllResearch', () => {
    it('should fetch all research successfully', async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResearchList)
      });

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
    it('should post research request successfully', async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResearchData)
      });

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

    it('should throw error when API call fails', async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid input')
      });

      await expect(postResearch(mockRequestInput)).rejects.toThrow();
    });
  });
});
