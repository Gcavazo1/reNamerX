/**
 * Path utilities for consistent path handling across the application
 */

/**
 * Returns the base path for the application
 * We hardcode this to match next.config.js for GitHub Pages
 */
export const getBasePath = (): string => {
  return '/reNamerX';
};

/**
 * Returns the full URL for a given path
 */
export const getFullUrl = (path: string): string => {
  // This should be updated to use the actual domain from environment variable
  const baseDomain = 'https://gcavazo1.github.io';
  const basePath = getBasePath();
  
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseDomain}${basePath}${normalizedPath}`;
};

/**
 * Returns a path with the base path prepended
 * This now assumes all input paths are relative and should have the base path added
 */
export const withBasePath = (path: string): string => {
  const basePath = getBasePath();
  
  // For root path, just return the base path
  if (!path || path === '/') return basePath;
  
  // Strip any leading slashes from the path
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Remove any instances of the repo name if already there (without the leading slash)
  // This ensures we never get /reNamerX/reNamerX/docs
  const basePathWithoutSlash = basePath.substring(1);
  const fullyCleanedPath = cleanPath.startsWith(basePathWithoutSlash + '/') 
    ? cleanPath.substring(basePathWithoutSlash.length + 1)
    : cleanPath;
  
  // Combine base path with cleaned path
  return `${basePath}/${fullyCleanedPath}`;
}; 