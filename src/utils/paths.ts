/**
 * Path utilities for consistent path handling across the application
 */

/**
 * Returns the base path for the application
 * In development, this is an empty string
 * In GitHub Pages, this is '/reNamerX'
 * In Vercel, this is an empty string
 */
export const getBasePath = (): string => {
  // Check if this is a GitHub Pages deployment or if the hostname includes github.io
  const isGitHubPages = process.env.GITHUB_PAGES === 'true' || 
    (typeof window !== 'undefined' && window.location.hostname.includes('github.io'));
  return isGitHubPages ? '/reNamerX' : '';
};

/**
 * Returns the full URL for a given path
 */
export const getFullUrl = (path: string): string => {
  // This should be updated to use the actual domain from environment variable
  const baseDomain = process.env.NEXT_PUBLIC_SITE_URL || 'https://renamerx.app';
  const basePath = getBasePath();
  
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseDomain}${basePath}${normalizedPath}`;
};

/**
 * Returns a path with the base path prepended
 */
export const withBasePath = (path: string): string => {
  const basePath = getBasePath();
  
  // Handle empty or root path
  if (!path || path === '/') return basePath || '/';
  
  // Remove any existing base path from the input path
  const cleanPath = path.replace(new RegExp(`^${basePath}`, 'i'), '');
  
  // Ensure path starts with a slash
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  return `${basePath}${normalizedPath}`;
}; 