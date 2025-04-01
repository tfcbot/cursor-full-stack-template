import { BunPlugin, plugin } from 'bun';
import { resolve } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.test') });

// Set up Bun test environment
export default {
  test: {
    timeout: 2000, // Set timeout to 2 seconds
    environment: 'node',
    include: ['**/*.test.ts', '**/tests/**/*.test.ts'],
    coverage: {
      enabled: process.env.COVERAGE === 'true',
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/**',
        'tests/mocks/**'
      ],
    },
  },
  plugins: [
    // Add any plugins if needed
  ],
  // Aliases to match the Jest configuration
  resolve: {
    alias: {
      '@packages/core/src': resolve(process.cwd(), 'src'),
      '@agent-runtime': resolve(process.cwd(), 'src/orchestrator/agent-runtime'),
      '@orchestrator': resolve(process.cwd(), 'src/orchestrator'),
      '@utils': resolve(process.cwd(), 'src/utils'),
      '@lib': resolve(process.cwd(), 'src/lib'),
      '@metadata': resolve(process.cwd(), 'src/metadata'),
    },
  },
}; 