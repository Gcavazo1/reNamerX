import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import useErrorHandler, { AppError, ErrorSeverity } from '../hooks/useErrorHandler';
import ErrorMessage from '../components/common/ErrorMessage';

// Define the context shape
interface ErrorContextType {
  handleError: (message: string, severity?: ErrorSeverity, details?: string, code?: string) => AppError;
  clearError: () => void;
  createErrorHandler: (context: string, defaultMessage?: string) => (error: any) => void;
}

// Create the context with a default value
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Provider props
interface ErrorProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps your app and makes error handling available everywhere
 */
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const { 
    error, 
    isVisible, 
    handleError, 
    clearError, 
    createErrorHandler 
  } = useErrorHandler();

  return (
    <ErrorContext.Provider value={{ handleError, clearError, createErrorHandler }}>
      {/* Show error message if there's an error */}
      {error && isVisible && (
        <div className="fixed inset-x-0 bottom-4 mx-auto z-50 max-w-md w-full shadow-lg flex justify-center">
          <div className="max-h-[40vh] overflow-auto w-full">
            <ErrorMessage 
              error={error} 
              onClose={clearError} 
              showDetails={process.env.NODE_ENV === 'development'}
            />
          </div>
        </div>
      )}
      {children}
    </ErrorContext.Provider>
  );
};

/**
 * Hook to use the error context
 */
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export default ErrorProvider; 