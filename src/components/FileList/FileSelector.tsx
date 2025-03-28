import React, { useState } from 'react';
import { useFileStore } from '../../stores/fileStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { selectFiles, selectDirectory } from '../../utils/api/fileSystemApi';
import { FileSystemError } from '../../utils/api/fileSystemError';
import DirectoryBrowser from './DirectoryBrowser';
import DirectoryHistory from './DirectoryHistory';
import { IFile } from '../../types/file';
import { useError } from '../../context/ErrorContext';
import { useFileFilterStore } from '../../stores/fileFilterStore';

const FileSelector: React.FC = () => {
  const { addFiles, setProcessing } = useFileStore();
  const { addRecentDirectory } = useSettingsStore();
  const { resetFilter } = useFileFilterStore();
  const { handleError } = useError();
  const [showDirectoryBrowser, setShowDirectoryBrowser] = useState<boolean>(false);
  const [selectedDirectoryPath, setSelectedDirectoryPath] = useState<string | null>(null);

  const handleBrowseFiles = async () => {
    try {
      setProcessing(true);
      // Reset filter when selecting new files
      resetFilter();
      const selectedFiles = await selectFiles();
      if (selectedFiles.length > 0) {
        // Extract directory path from the first file and save to history
        const firstFile = selectedFiles[0];
        const lastSeparatorIndex = Math.max(
          firstFile.path.lastIndexOf('/'), 
          firstFile.path.lastIndexOf('\\')
        );
        
        if (lastSeparatorIndex > 0) {
          const dirPath = firstFile.path.substring(0, lastSeparatorIndex);
          addRecentDirectory(dirPath);
        }
        
        addFiles(selectedFiles);
      }
    } catch (error) {
      if (error instanceof FileSystemError) {
        handleError(error.message, 'warning', error.originalError?.stack);
      } else {
        handleError(
          `Failed to select files: ${error instanceof Error ? error.message : String(error)}`,
          'error',
          error instanceof Error ? error.stack : undefined
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleBrowseDirectory = async () => {
    try {
      setProcessing(true);
      // Reset filter when selecting new directory
      resetFilter();
      const directoryPath = await selectDirectory();
      
      if (directoryPath) {
        setSelectedDirectoryPath(directoryPath);
        setShowDirectoryBrowser(true);
        addRecentDirectory(directoryPath);
      }
    } catch (error) {
      if (error instanceof FileSystemError) {
        handleError(error.message, 'warning', error.originalError?.stack);
      } else {
        handleError(
          `Failed to select directory: ${error instanceof Error ? error.message : String(error)}`,
          'error',
          error instanceof Error ? error.stack : undefined
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleDirectoryFilesSelected = (files: IFile[]) => {
    // Ensure files is an array before filtering
    if (!Array.isArray(files)) {
      console.error('Expected files to be an array but got:', files);
      return;
    }
    
    // Filter to only include non-directory files
    const nonDirectoryFiles = files.filter(file => !file.isDirectory);
    
    if (nonDirectoryFiles.length > 0) {
      addFiles(nonDirectoryFiles);
    }
    setShowDirectoryBrowser(false);
  };

  return (
    <div className="mt-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg 
            className="h-12 w-12 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
            />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select files or folders to rename
          </p>
           
          <div className="flex flex-wrap justify-center space-x-4 mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleBrowseFiles}
            >
              Select Files
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={handleBrowseDirectory}
            >
              Select Folder
            </button>
          </div>
          
          <DirectoryHistory />
        </div>
      </div>

      {showDirectoryBrowser && selectedDirectoryPath && (
        <DirectoryBrowser
          initialPath={selectedDirectoryPath}
          onSelectFiles={handleDirectoryFilesSelected}
          onClose={() => setShowDirectoryBrowser(false)}
        />
      )}
    </div>
  );
};

export default FileSelector; 