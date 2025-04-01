module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../src', '<rootDir>'],
  modulePaths: ['<rootDir>/..'],
  moduleNameMapper: {
    '^@packages/core/src(.*)$': '<rootDir>/../$1',
    '^@agent-runtime/(.*)$': '<rootDir>/../src/orchestrator/agent-runtime/$1',
    '^@orchestrator/(.*)$': '<rootDir>/../src/orchestrator/$1',
    '^@utils/(.*)$': '<rootDir>/../src/utils/$1',
    '^@lib/(.*)$': '<rootDir>/../src/lib/$1',
    '^@metadata/(.*)$': '<rootDir>/../src/metadata/$1',
  },
  testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/../tsconfig.json',
      isolatedModules: true,
      diagnostics: false
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(sst)/)',
  ],
  collectCoverage: false,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '../src/**/*.{js,jsx,ts,tsx}',
    '!../src/**/*.d.ts',
    '!../src/**/node_modules/**',
    '!../src/**/vendor/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
};
