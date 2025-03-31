/**
 * Path utilities for consistent path handling across the application
 */

/**
 * Returns the base path for the application
 */
export const getBasePath = (): string => {
  // Only use the /reNamerX base path when deployed to GitHub Pages
  if (typeof window !== 'undefined') {
    // Check if we're on GitHub Pages
    if (window.location.hostname === 'gcavazo1.github.io') {
      return '/reNamerX';
    }
    // On Vercel or other platforms
    return '';
  }
  
  // During SSR, check environment variable
  if (process.env.GITHUB_PAGES === 'true') {
    return '/reNamerX';
  }
  
  return '';
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