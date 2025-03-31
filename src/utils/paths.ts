/**
 * Path utilities for consistent path handling across the application
 */

/**
 * Returns the base path for the application
 * Used only for references, not for modifying paths
 */
export const getBasePath = (): string => {
  return '/reNamerX';
};

/**
 * Returns the full URL for a given path including domain and basePath
 * Useful for meta tags and external references
 */
export const getFullUrl = (path: string): string => {
  const baseDomain = 'https://gcavazo1.github.io';
  const basePath = getBasePath();
  
  // Clean the path to avoid duplication
  const cleanPath = path
    .replace(/^\/reNamerX\//, '/') // Remove /reNamerX/ prefix if present
    .replace(/^reNamerX\//, '/'); // Also handle without leading slash
  
  return `${baseDomain}${basePath}${cleanPath}`;
};

/**
 * This function is maintained for backward compatibility.
 * Next.js automatically adds basePath to all links, so we should 
 * only need to clean paths to ensure no duplication.
 */
export const withBasePath = (path: string): string => {
  // For assets references, we need the basePath, but for routing,
  // Next.js handles this automatically through the Link component.
  
  // For compatibility, we'll still clean any duplicated paths
  const cleanPath = path
    .replace(/^\/reNamerX\//, '/') // Remove /reNamerX/ prefix if present
    .replace(/^reNamerX\//, '/');  // Also handle without leading slash
  
  return cleanPath;
}; 