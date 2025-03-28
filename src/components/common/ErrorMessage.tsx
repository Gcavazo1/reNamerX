import React, { useState } from 'react';
import { AppError, ErrorSeverity } from '../../hooks/useErrorHandler';

interface ErrorMessageProps {
  error: AppError;
  onClose: () => void;
  showDetails?: boolean;
}

/**
 * Component for displaying error messages with appropriate styling based on severity
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onClose,
  showDetails = false
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Define appropriate styling based on error severity
  const getSeverityStyles = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'info':
        return {
          containerClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          iconClass: 'text-blue-500 dark:text-blue-400',
          titleClass: 'text-blue-800 dark:text-blue-300',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'warning':
        return {
          containerClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          iconClass: 'text-yellow-500 dark:text-yellow-400',
          titleClass: 'text-yellow-800 dark:text-yellow-300',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'error':
        return {
          containerClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          iconClass: 'text-red-500 dark:text-red-400',
          titleClass: 'text-red-800 dark:text-red-300',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'fatal':
        return {
          containerClass: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
          iconClass: 'text-purple-500 dark:text-purple-400',
          titleClass: 'text-purple-800 dark:text-purple-300',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          containerClass: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          iconClass: 'text-gray-500 dark:text-gray-400',
          titleClass: 'text-gray-800 dark:text-gray-300',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const styles = getSeverityStyles(error.severity);
  
  // Check if message is too long
  const isLongMessage = error.message.length > 100;
  const displayMessage = isLongMessage && !expanded 
    ? `${error.message.substring(0, 100)}...` 
    : error.message;

  return (
    <div
      className={`border rounded-md p-4 mb-4 ${styles.containerClass} relative`}
      role="alert"
    >
      <div className="flex">
        <div className={`flex-shrink-0 ${styles.iconClass}`}>
          {styles.icon}
        </div>
        <div className="ml-3 flex-grow">
          <h3 className={`text-sm font-medium ${styles.titleClass}`}>
            {displayMessage}
            {isLongMessage && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                className="ml-2 text-xs underline font-normal"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </h3>
          {error.code && (
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              Error code: {error.code}
            </p>
          )}
          {showDetails && error.details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                Show more details
              </summary>
              <pre className="mt-2 text-xs p-2 bg-white dark:bg-gray-900 rounded-md overflow-auto max-h-32">
                {error.details}
              </pre>
            </details>
          )}
        </div>
      </div>
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ErrorMessage; 