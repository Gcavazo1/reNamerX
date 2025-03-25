import React from 'react';
import { useFileStore } from '../../stores/fileStore';

const LoadingOverlay: React.FC = () => {
  const { processing } = useFileStore();

  if (!processing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="mt-4 text-lg font-medium">Processing...</div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This may take a moment
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 