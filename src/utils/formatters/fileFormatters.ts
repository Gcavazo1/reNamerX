/**
 * Utility functions for formatting file-related information
 */

/**
 * Convert a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get a human-readable representation of a date
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
} 