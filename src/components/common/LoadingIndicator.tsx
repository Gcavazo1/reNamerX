import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  progress?: number;
  total?: number;
  isOverlay?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  progress,
  total,
  isOverlay = false
}) => {
  // Calculate percentage if progress and total are provided
  const percentage = progress !== undefined && total !== undefined && total > 0
    ? Math.round((progress / total) * 100)
    : undefined;
  
  const content = (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <svg 
          className="animate-spin h-10 w-10 text-blue-500" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {percentage !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              {percentage}%
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{message}</p>
        {progress !== undefined && total !== undefined && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {progress} of {total} items processed
          </p>
        )}
      </div>
    </div>
  );

  if (isOverlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingIndicator; 