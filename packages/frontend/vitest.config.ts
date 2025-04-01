import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: process.env.TEST_TYPE === 'integration' 
      ? ['tests/integration/**/*.test.ts', 'tests/integration/**/*.test.tsx'] 
      : process.env.TEST_TYPE === 'unit'
        ? ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx']
        : ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        '.next/**',
        'public/**',
        'vitest.config.ts',
        'vitest.setup.ts',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.mjs',
        '**/*.config.ts'
      ]
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@metadata': path.resolve(__dirname, '../metadata')
    }
  }
}); 