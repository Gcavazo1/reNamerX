import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { IFile } from '../../types/file';
import { listDirectoryFiles } from '../../utils/api/fileSystemApi';
import { FileSystemError } from '../../utils/api/fileSystemError';
import { useFileStore } from '../../stores/fileStore';
import { useFileFilterStore } from '../../stores/fileFilterStore';
import { useError } from '../../context/ErrorContext';
import { formatFileSize } from '../../utils/fileUtils';

interface DirectoryBrowserProps {
  initialPath?: string;
  onSelectFiles: (files: IFile[]) => void;
  onClose: () => void;
}

const DirectoryBrowser: React.FC<DirectoryBrowserProps> = ({
  initialPath,
  onSelectFiles,
  onClose
}) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath || '');
  const [directoryContents, setDirectoryContents] = useState<IFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { setProcessing } = useFileStore();
  const { activeFilter } = useFileFilterStore();
  const { handleError } = useError();

  // Load directory contents when path changes
  useEffect(() => {
    if (currentPath) {
      loadDirectoryContents(currentPath);
    }
  }, [currentPath]); // Only depend on currentPath

  // Instead, calculate filteredContents at render time
  const filteredContents = useMemo(() => {
    if (!directoryContents) return [];
    
    return directoryContents.filter(file => {
      if (file.isDirectory) return true; // Always show directories
      if (!activeFilter) return true; // No filter active
      
      return useFileFilterStore.getState().isFileTypeMatched(file.name);
    });
  }, [directoryContents, activeFilter]);

  const loadDirectoryContents = async (path: string) => {
    setIsLoading(true);
    setProcessing(true);
    
    try {
      // Request only non-directory files
      const files = await listDirectoryFiles(path, true);
      
      // Ensure files is an array before filtering
      if (!Array.isArray(files)) {
        handleError('Expected files to be an array but got: ' + typeof files, 'error');
        setDirectoryContents([]);
        return;
      }
      
      // Extra safety filter - only include actual files, not directories
      const onlyFiles = files.filter(file => 
        !file.isDirectory && 
        file.name.toLowerCase() !== 'desktop.ini' && 
        !file.name.startsWith('.')
      );
      
      setDirectoryContents(onlyFiles);
    } catch (err) {
      if (err instanceof FileSystemError) {
        handleError(err.message, 'warning', err.originalError?.stack);
      } else {
        handleError(
          `Failed to load directory contents: ${err instanceof Error ? err.message : String(err)}`,
          'error',
          err instanceof Error ? err.stack : undefined
        );
      }
    } finally {
      setIsLoading(false);
      setProcessing(false);
    }
  };

  const handleNavigateUp = () => {
    const pathParts = currentPath.split(/[/\\]/);
    pathParts.pop();
    const parentPath = pathParts.join('/');
    
    if (parentPath) {
      setCurrentPath(parentPath);
      setSelectedItems([]);
    }
  };

  const handleToggleSelect = (file: IFile) => {
    setSelectedItems(prev => {
      if (prev.includes(file.id)) {
        return prev.filter(id => id !== file.id);
      } else {
        return [...prev, file.id];
      }
    });
  };

  const handleSelectAll = () => {
    const allSelected = filteredContents.every(file => 
      selectedItems.includes(file.id)
    );
    
    if (allSelected) {
      // Deselect all if all are selected
      setSelectedItems([]);
    } else {
      // Select all files
      setSelectedItems(
        filteredContents.map(file => file.id)
      );
    }
  };

  const handleConfirmSelection = () => {
    // Only include non-directory files that were selected
    const selectedFiles = filteredContents.filter(file => 
      selectedItems.includes(file.id)
    );
    
    if (selectedFiles.length > 0) {
      onSelectFiles(selectedFiles);
    } else {
      handleError('No files selected. Please select at least one file.', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Browse Directory</h2>
          <button
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mr-3"
            onClick={handleNavigateUp}
          >
            <span aria-hidden="true">&larr;</span> Up
          </button>
          <div className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 truncate">
            {currentPath}
          </div>
        </div>
        
        <div className="flex-0 border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredContents.length} files
          </div>
          <button
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleSelectAll}
          >
            {filteredContents.every(file => selectedItems.includes(file.id)) &&
             filteredContents.length > 0
              ? 'Unselect All'
              : 'Select All'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-8">
              {directoryContents.length === 0 
                ? 'This directory is empty'
                : 'No files found in this directory'}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContents.map(file => (
                <div 
                  key={file.id}
                  className={`
                    p-3 rounded-lg cursor-pointer border
                    ${selectedItems.includes(file.id)
                      ? 'bg-blue-50 border-blue-300 dark:border-blue-500 dark:bg-blue-900/20' 
                      : 'bg-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                    transition-all
                  `}
                  onClick={() => handleToggleSelect(file)}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {file.type && `.${file.type}`} {" · "} {formatFileSize(file.size)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedItems.length > 0 
              ? `${selectedItems.length} file${selectedItems.length !== 1 ? 's' : ''} selected`
              : 'No files selected'}
          </div>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`
                px-4 py-2 rounded
                ${selectedItems.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                transition-colors
              `}
              onClick={handleConfirmSelection}
              disabled={selectedItems.length === 0}
            >
              Select Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryBrowser; 