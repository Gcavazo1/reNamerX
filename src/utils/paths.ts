/**
 * Path utilities for consistent path handling across the application
 */

/**
 * Returns the base path for the application
 * In development, this is an empty string
 * In production (GitHub Pages), this is '/reNamerX'
 */
export const getBasePath = (): string => {
  return process.env.NODE_ENV === 'production' ? '/reNamerX' : '';
};

/**
 * Returns the full URL for a given path
 */
export const getFullUrl = (path: string): string => {
  const baseDomain = 'https://gcavazo1.github.io';
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
  
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}; 