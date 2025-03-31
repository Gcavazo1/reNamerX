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
 * SIMPLIFIED VERSION - guaranteed not to duplicate base paths
 */
export const withBasePath = (path: string): string => {
  // Get our base path (/reNamerX or '')
  const basePath = getBasePath();
  
  // If there's no base path or we're not on GitHub Pages, just return the path normalized
  if (!basePath) {
    return path === '/' ? '/' : (path.startsWith('/') ? path : `/${path}`);
  }
  
  // Log for debugging
  if (typeof window !== 'undefined' && path.includes(basePath)) {
    console.warn('withBasePath received path that already contains basePath:', path);
  }
  
  // For root path, just return the base path
  if (!path || path === '/') return basePath;
  
  // Strip any leading slashes from the path
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // STRICT CHECK: Remove any instances of the basePath (without the leading slash)
  // This ensures we never get /reNamerX/reNamerX/docs
  const basePathWithoutSlash = basePath.substring(1);
  const fullyCleanedPath = cleanPath.startsWith(basePathWithoutSlash + '/') 
    ? cleanPath.substring(basePathWithoutSlash.length + 1)
    : cleanPath;
  
  // Combine base path with cleaned path
  return `${basePath}/${fullyCleanedPath}`;
}; 