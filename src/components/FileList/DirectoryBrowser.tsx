import React, { useEffect, useState } from 'react';
import { IFile } from '../../types/file';
import { listDirectoryFiles } from '../../utils/api/fileSystemApi';
import { useFileStore } from '../../stores/fileStore';

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
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { setProcessing } = useFileStore();

  useEffect(() => {
    if (currentPath) {
      loadDirectoryContents(currentPath);
    }
  }, [currentPath]);

  const loadDirectoryContents = async (path: string) => {
    setIsLoading(true);
    setError(null);
    setProcessing(true);
    
    try {
      const files = await listDirectoryFiles(path);
      setDirectoryContents(files);
    } catch (err) {
      setError('Failed to load directory contents. Please try again.');
    } finally {
      setIsLoading(false);
      setProcessing(false);
    }
  };

  const handleNavigate = (file: IFile) => {
    if (file.isDirectory) {
      setCurrentPath(file.path);
      setSelectedItems([]);
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
    if (selectedItems.length === directoryContents.filter(f => !f.isDirectory).length) {
      // Deselect all if all are selected
      setSelectedItems([]);
    } else {
      // Select all files (not directories)
      setSelectedItems(
        directoryContents
          .filter(file => !file.isDirectory)
          .map(file => file.id)
      );
    }
  };

  const handleConfirmSelection = () => {
    const selectedFiles = directoryContents.filter(file => 
      selectedItems.includes(file.id) && !file.isDirectory
    );
    
    if (selectedFiles.length > 0) {
      onSelectFiles(selectedFiles);
    } else {
      setError('No files selected. Please select at least one file.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-4/5 max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Browse Directory</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={handleNavigateUp}
              disabled={!currentPath.includes('/') && !currentPath.includes('\\')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto whitespace-nowrap">
              {currentPath || 'No directory selected'}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 m-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : directoryContents.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-8">
              This directory is empty
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {directoryContents.map(file => (
                <div 
                  key={file.id}
                  className={`
                    p-3 rounded-lg cursor-pointer border 
                    ${file.isDirectory 
                      ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                      : selectedItems.includes(file.id)
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }
                    hover:shadow transition-all
                  `}
                  onClick={() => file.isDirectory ? handleNavigate(file) : handleToggleSelect(file)}
                >
                  <div className="flex items-start space-x-2">
                    <div className="text-gray-400 mt-1">
                      {file.isDirectory ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium truncate">{file.name}</div>
                      {!file.isDirectory && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {file.type ? `.${file.type}` : ''} • {formatBytes(file.size)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline"
              onClick={handleSelectAll}
            >
              {selectedItems.length === directoryContents.filter(f => !f.isDirectory).length 
                ? 'Deselect All' 
                : 'Select All Files'}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedItems.length} file{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirmSelection}
              disabled={selectedItems.length === 0}
            >
              Select {selectedItems.length} File{selectedItems.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format file size
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default DirectoryBrowser; 