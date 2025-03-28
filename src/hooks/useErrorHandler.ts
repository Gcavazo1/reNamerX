import { useState, useCallback } from 'react';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export interface AppError {
  message: string;
  details?: string;
  code?: string;
  severity: ErrorSeverity;
  timestamp: Date;
}

/**
 * Custom hook for handling errors in a consistent way across the application
 */
const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  /**
   * Handles an error by setting the error state and making it visible
   */
  const handleError = useCallback((
    message: string, 
    severity: ErrorSeverity = 'error',
    details?: string,
    code?: string
  ) => {
    const newError: AppError = {
      message,
      details,
      code,
      severity,
      timestamp: new Date()
    };
    
    setError(newError);
    setIsVisible(true);
    
    // Log errors to console for debugging
    if (severity === 'error' || severity === 'fatal') {
      console.error(`[${severity.toUpperCase()}]`, message, details || '');
    } else {
      console.warn(`[${severity.toUpperCase()}]`, message, details || '');
    }

    return newError;
  }, []);

  /**
   * Clears the current error and hides the error UI
   */
  const clearError = useCallback(() => {
    setIsVisible(false);
    // We don't immediately clear the error to allow for exit animations
    setTimeout(() => setError(null), 300);
  }, []);

  /**
   * Creates an error handler function for try/catch blocks
   */
  const createErrorHandler = useCallback((
    context: string, 
    defaultMessage = 'An unexpected error occurred'
  ) => {
    return (error: any) => {
      const errorMessage = error?.message || defaultMessage;
      const errorDetails = error?.stack;
      
      handleError(
        `${context}: ${errorMessage}`,
        'error',
        errorDetails
      );
      
      // Rethrow the error if needed for parent error boundaries
      // Uncomment if you want errors to propagate up
      // throw error;
    };
  }, [handleError]);

  return {
    error,
    isVisible,
    handleError,
    clearError,
    createErrorHandler
  };
};

export default useErrorHandler; 