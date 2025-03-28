/**
 * Enum for file system error types
 */
export enum FileSystemErrorType {
  ACCESS_DENIED = 'ACCESS_DENIED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INVALID_PATH = 'INVALID_PATH',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Custom error class for file system operations
 */
export class FileSystemError extends Error {
  readonly type: FileSystemErrorType;
  readonly originalError?: Error;

  constructor(
    message: string,
    type: FileSystemErrorType | string = FileSystemErrorType.UNKNOWN,
    originalError?: Error | unknown
  ) {
    super(message);
    this.name = 'FileSystemError';
    
    // Ensure we're using a valid error type
    if (Object.values(FileSystemErrorType).includes(type as FileSystemErrorType)) {
      this.type = type as FileSystemErrorType;
    } else {
      this.type = FileSystemErrorType.UNKNOWN;
    }
    
    // Store the original error for debugging
    if (originalError instanceof Error) {
      this.originalError = originalError;
    }
    
    // For better stack traces in modern JavaScript
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileSystemError);
    }
  }

  /**
   * Create a FileSystemError from a native error
   */
  static fromNativeError(error: unknown, path?: string): FileSystemError {
    let message: string;
    let type: FileSystemErrorType = FileSystemErrorType.UNKNOWN;
    
    if (error instanceof Error) {
      message = error.message;
      
      // Try to infer the error type from the message
      if (message.includes('permission denied') || message.includes('access denied')) {
        type = FileSystemErrorType.PERMISSION_DENIED;
      } else if (message.includes('no such file') || message.includes('not found')) {
        type = FileSystemErrorType.FILE_NOT_FOUND;
      } else if (message.includes('invalid path') || message.includes('invalid argument')) {
        type = FileSystemErrorType.INVALID_PATH;
      } else if (message.includes('already exists')) {
        type = FileSystemErrorType.ALREADY_EXISTS;
      }
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = 'Unknown file system error';
    }
    
    // Add path information if available
    if (path) {
      message += ` (path: ${path})`;
    }
    
    return new FileSystemError(message, type, error);
  }
} 