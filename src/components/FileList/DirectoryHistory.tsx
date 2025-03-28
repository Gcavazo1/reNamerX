import React, { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { listDirectoryFiles } from '../../utils/api/fileSystemApi';
import { FileSystemError } from '../../utils/api/fileSystemError';
import { useFileStore } from '../../stores/fileStore';
import { useError } from '../../context/ErrorContext';
import { useFileFilterStore } from '../../stores/fileFilterStore';

const DirectoryHistory: React.FC = () => {
  const { recentDirectories, clearRecentDirectories } = useSettingsStore();
  const { addFiles, setProcessing } = useFileStore();
  const { resetFilter } = useFileFilterStore();
  const { handleError } = useError();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleClearHistory = () => {
    clearRecentDirectories();
    setIsDropdownOpen(false); // Close dropdown after clearing
  };

  const handleOpenDirectory = async (dirPath: string) => {
    try {
      setIsLoading(dirPath);
      setProcessing(true);
      setIsDropdownOpen(false);
      
      // Reset filter to ensure all files are shown
      resetFilter();
      
      const files = await listDirectoryFiles(dirPath);
      
      if (!Array.isArray(files)) {
        console.error('Expected files to be an array but got:', files);
        handleError('Failed to load files from this directory.', 'error');
        return;
      }
      
      const nonDirectoryFiles = files.filter(file => !file.isDirectory);
      
      if (nonDirectoryFiles.length > 0) {
        addFiles(nonDirectoryFiles);
      } else {
        handleError('No files found in this directory.', 'warning');
      }
    } catch (err) {
      if (err instanceof FileSystemError) {
        handleError(err.message, 'warning', err.originalError?.stack);
      } else {
        handleError(
          `Failed to open directory: ${err instanceof Error ? err.message : String(err)}`,
          'error',
          err instanceof Error ? err.stack : undefined
        );
      }
    } finally {
      setIsLoading(null);
      setProcessing(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex justify-between items-center w-full rounded-md border border-gray-600 dark:border-gray-500 px-4 py-2 bg-gray-800 dark:bg-gray-900 text-sm font-medium text-gray-200 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="flex items-center">
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Recent Directories
        </span>
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop to capture clicks outside */}
          <div 
            className="fixed inset-0 z-20"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-200 dark:text-gray-300 border-b border-gray-700 dark:border-gray-600">
                Recent Directories
              </div>
              
              <div className="max-h-60 overflow-auto">
                {recentDirectories.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500 italic">
                    No recent directories
                  </div>
                ) : (
                  recentDirectories.map((dir, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center justify-between group transition-colors"
                      onClick={() => handleOpenDirectory(dir)}
                      disabled={isLoading !== null}
                    >
                      <span className="truncate flex-1 group-hover:text-gray-100">{dir}</span>
                      {isLoading === dir && (
                        <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </div>
              
              {recentDirectories.length > 0 && (
                <div className="border-t border-gray-700 dark:border-gray-600 mt-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-400 dark:text-red-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-red-300 transition-colors"
                    onClick={handleClearHistory}
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DirectoryHistory; 