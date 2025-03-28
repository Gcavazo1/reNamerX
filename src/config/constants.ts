// File system operation constants
export const CHUNK_SIZE = 50; // Number of files to process in each batch

// UI Constants
export const MIN_WINDOW_WIDTH = 800;
export const MIN_WINDOW_HEIGHT = 600;
export const DEFAULT_PREVIEW_WIDTH = 600;
export const DEFAULT_PREVIEW_HEIGHT = 500;

// File type categories
export const FILE_TYPE_CATEGORIES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
  AUDIO: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'],
  VIDEO: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'],
  ARCHIVES: ['zip', 'rar', '7z', 'tar', 'gz'],
  CODE: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'cs', 'php', 'html', 'css']
};

// Error messages
export const ERROR_MESSAGES = {
  FILE_NOT_FOUND: 'File not found',
  PERMISSION_DENIED: 'Permission denied',
  INVALID_PATH: 'Invalid file path',
  NETWORK_ERROR: 'Network error',
  UNKNOWN_ERROR: 'An unknown error occurred'
}; 