/**
 * Test setup for Jest
 * This file contains global mocks and configurations for testing
 */

// Mock Tauri API
jest.mock('@tauri-apps/api', () => ({
  invoke: jest.fn(),
}));

// Mock window.confirm to always return true in tests
window.confirm = jest.fn(() => true);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Setup global mocks for Tauri plugins
jest.mock('@tauri-apps/plugin-dialog', () => ({
  open: jest.fn().mockResolvedValue('/path/to/file'),
  save: jest.fn().mockResolvedValue('/path/to/save'),
}));

// Default timeout for tests
jest.setTimeout(10000); 