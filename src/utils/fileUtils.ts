/**
 * Path utilities for browser environment
 * This simulates Node.js path module functionality but works in the browser
 */
export const pathUtils = {
  basename: (path: string): string => {
    if (!path) return '';
    // Handle both forward and backward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.split('/').pop() || '';
  },
  
  dirname: (path: string): string => {
    if (!path) return '.';
    // Handle both forward and backward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    const lastSlashIndex = normalizedPath.lastIndexOf('/');
    return lastSlashIndex === -1 ? '.' : normalizedPath.slice(0, lastSlashIndex);
  },
  
  join: (...paths: string[]): string => {
    // Filter out empty segments, null, and undefined
    return paths
      .filter((p): p is string => p != null && p !== '')
      .join('/')
      .replace(/\/+/g, '/'); // Replace multiple consecutive slashes with a single one
  },
  
  extname: (path: string): string => {
    if (!path) return '';
    const basename = pathUtils.basename(path);
    const dotIndex = basename.lastIndexOf('.');
    return dotIndex === -1 || dotIndex === 0 ? '' : basename.slice(dotIndex);
  },

  // New utility functions
  normalize: (path: string): string => {
    if (!path) return '';
    return path.replace(/\\/g, '/');
  },

  removeExt: (path: string): string => {
    if (!path) return '';
    const ext = pathUtils.extname(path);
    return ext ? path.slice(0, -ext.length) : path;
  },

  isAbsolute: (path: string): boolean => {
    if (!path) return false;
    const normalized = pathUtils.normalize(path);
    return normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized);
  }
};

// Re-export formatting functions from the formatters module
export { formatFileSize, formatDate } from './formatters/fileFormatters'; 