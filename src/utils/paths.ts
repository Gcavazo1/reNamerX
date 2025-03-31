/**
 * Path utilities for consistent path handling across the application
 */

// Detect if we're running on GitHub Pages
export const isGitHubPages = (): boolean => {
  if (typeof window !== 'undefined') {
    // Client-side detection
    return window.location.hostname === 'gcavazo1.github.io';
  }
  // Server-side detection
  return process.env.GITHUB_PAGES === 'true';
};

/**
 * Returns the base path for the application
 */
export const getBasePath = (): string => {
  return isGitHubPages() ? '/reNamerX' : '';
};

/**
 * Returns the full URL including domain and basePath
 */
export const getFullUrl = (path: string): string => {
  const baseDomain = 'https://gcavazo1.github.io';
  const basePath = getBasePath();
  
  // Ensure path doesn't already have basePath
  const cleanPath = path.replace(/^\/?reNamerX\//, '/');
  
  return `${baseDomain}${basePath}${cleanPath}`;
};

/**
 * Maintained for compatibility with existing code
 */
export const withBasePath = (path: string): string => {
  // Just clean the path, Next.js Link handles basePath automatically
  return path.replace(/^\/?reNamerX\//, '/');
}; 