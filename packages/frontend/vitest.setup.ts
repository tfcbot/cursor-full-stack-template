import 'cross-fetch/polyfill';
import { afterEach, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import dotenv from 'dotenv';
import path from 'path';

// Store original console methods
const originalConsoleError = console.error;

// Set up any global mocks needed for tests
beforeAll(() => {
  // Mock global browser APIs
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Load appropriate environment variables
  const envFile = process.env.TEST_TYPE === 'integration' 
    ? '.env.integration.test' 
    : '.env.test';
    
  dotenv.config({ 
    path: path.resolve(process.cwd(), envFile),
    override: true,
  });
  
  // Set default timeout higher for integration tests
  if (process.env.TEST_TYPE === 'integration') {
    vi.setConfig({ testTimeout: 10000 }); // 10 seconds for integration tests
  }
});

// Mock console.error before each test
beforeEach(() => {
  // Silence console.error during tests to avoid seeing expected error messages
  console.error = vi.fn();
});

// Clean up after each test
afterEach(() => {
  vi.resetAllMocks();
});

// Restore console methods after all tests
afterAll(() => {
  console.error = originalConsoleError;
}); 