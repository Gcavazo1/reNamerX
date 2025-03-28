import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in its child component tree.
 * It logs the errors and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call the optional onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, render the default error UI
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            Something went wrong
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            An error occurred in this section of the application. 
            Try refreshing the page or contact support if the problem persists.
          </p>
          <details className="bg-white dark:bg-gray-800 p-3 rounded-md mt-2">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 text-sm overflow-auto max-h-36 p-2 bg-gray-100 dark:bg-gray-900 rounded">
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 