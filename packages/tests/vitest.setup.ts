import 'cross-fetch/polyfill';
import { afterEach, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Store original console methods
const originalConsoleError = console.error;

// Set up any global mocks needed for tests
beforeAll(() => {
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
    vi.setConfig({ testTimeout: 20000 }); // 20 seconds for integration tests
  }

  // Mock fetch since we're in Node environment
  global.fetch = vi.fn();
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