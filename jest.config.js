/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/stay_hard_956/'
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle static assets
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
}; 