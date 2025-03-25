/**
 * Characters that are invalid in Windows file names
 */
const WINDOWS_INVALID_CHARS = /[<>:"\/\\|?*\x00-\x1F]/g;

/**
 * Reserved file names in Windows
 */
const WINDOWS_RESERVED_NAMES = [
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
];

/**
 * Maximum file name length for different operating systems
 */
const MAX_FILENAME_LENGTH = {
  WINDOWS: 255,
  MAC: 255,
  LINUX: 255
};

/**
 * Validates if a file name is valid across different operating systems
 */
export const isValidFileName = (fileName: string): boolean => {
  // Check for empty file name
  if (!fileName || fileName.trim() === '') {
    return false;
  }
  
  // Check for Windows invalid characters
  if (WINDOWS_INVALID_CHARS.test(fileName)) {
    return false;
  }
  
  // Check for Windows reserved names
  const baseName = fileName.split('.')[0].toUpperCase();
  if (WINDOWS_RESERVED_NAMES.includes(baseName)) {
    return false;
  }
  
  // Check for file name length
  if (fileName.length > MAX_FILENAME_LENGTH.WINDOWS) {
    return false;
  }
  
  // Check for file names that start or end with spaces or periods
  if (fileName.startsWith(' ') || fileName.endsWith(' ') || 
      fileName.startsWith('.') || fileName.endsWith('.')) {
    return false;
  }
  
  return true;
};

/**
 * Sanitizes a file name to be valid across different operating systems
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName) return '';
  
  // Replace invalid characters with underscores
  let sanitized = fileName.replace(WINDOWS_INVALID_CHARS, '_');
  
  // Trim spaces and periods from start and end
  sanitized = sanitized.trim().replace(/\.+$/, '');
  
  // Check if it's a reserved name and append underscore if needed
  const baseName = sanitized.split('.')[0].toUpperCase();
  if (WINDOWS_RESERVED_NAMES.includes(baseName)) {
    const parts = sanitized.split('.');
    parts[0] = `${parts[0]}_`;
    sanitized = parts.join('.');
  }
  
  // Truncate if too long
  if (sanitized.length > MAX_FILENAME_LENGTH.WINDOWS) {
    const extension = sanitized.lastIndexOf('.') > 0 
      ? sanitized.slice(sanitized.lastIndexOf('.'))
      : '';
    
    const nameWithoutExtension = sanitized.slice(0, sanitized.length - extension.length);
    const maxNameLength = MAX_FILENAME_LENGTH.WINDOWS - extension.length;
    
    sanitized = nameWithoutExtension.slice(0, maxNameLength) + extension;
  }
  
  return sanitized || '_'; // Return '_' if sanitized to empty string
};

/**
 * Gets error message for an invalid file name
 */
export const getFileNameError = (fileName: string): string | null => {
  if (!fileName || fileName.trim() === '') {
    return 'File name cannot be empty';
  }
  
  if (WINDOWS_INVALID_CHARS.test(fileName)) {
    return 'File name contains invalid characters';
  }
  
  const baseName = fileName.split('.')[0].toUpperCase();
  if (WINDOWS_RESERVED_NAMES.includes(baseName)) {
    return `"${baseName}" is a reserved file name`;
  }
  
  if (fileName.length > MAX_FILENAME_LENGTH.WINDOWS) {
    return `File name is too long (maximum ${MAX_FILENAME_LENGTH.WINDOWS} characters)`;
  }
  
  if (fileName.startsWith(' ') || fileName.endsWith(' ')) {
    return 'File name cannot start or end with spaces';
  }
  
  if (fileName.startsWith('.') || fileName.endsWith('.')) {
    return 'File name cannot start or end with periods';
  }
  
  return null;
}; 