import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      '**/*.test.ts',
      '**/*.test.tsx'
    ],
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
      '@services': path.resolve(__dirname, '../frontend/src/services'),
      '@metadata': path.resolve(__dirname, '../metadata')
    }
  }
}); 