import React from 'react';
import { useFileStore } from '../../stores/fileStore';
import { useRulesStore } from '../../stores/rulesStore';
import MetadataPreview from './MetadataPreview';

const FileList: React.FC = () => {
  const { files, selectedFiles, selectFile, deselectFile, selectAllFiles, deselectAllFiles, clearFiles } = useFileStore();
  const { rules } = useRulesStore();
  
  const handleToggleSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      deselectFile(fileId);
    } else {
      selectFile(fileId);
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      deselectAllFiles();
    } else {
      selectAllFiles();
    }
  };

  const handleClearFiles = () => {
    if (window.confirm('Are you sure you want to clear all files?')) {
      clearFiles();
    }
  };

  const handleRowClick = (fileId: string) => {
    handleToggleSelection(fileId);
  };

  const isMetadataEnabled = rules.advanced.metadata.enabled;

  return (
    <div className="mb-4">
      {/* Metadata Preview Section */}
      {isMetadataEnabled && <MetadataPreview />}
      
      {/* File List Controls */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Files</h3>
        <div className="space-x-2">
          <button
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleSelectAll}
          >
            {selectedFiles.length === files.length && selectedFiles.length > 0 ? 'Unselect All' : 'Select All'}
          </button>
          <button
            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={handleClearFiles}
          >
            Clear Files
          </button>
        </div>
      </div>

      {/* File List Table */}
      {files.length > 0 ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="w-10 px-3 py-2"></th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {files.map((file) => (
                <tr 
                  key={file.id} 
                  className={`${
                    selectedFiles.includes(file.id) 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  } cursor-pointer`}
                  onClick={() => handleRowClick(file.id)}
                >
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelection(file.id);
                      }}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {file.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {file.type}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No files selected. Please select files to rename.</p>
        </div>
      )}
    </div>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FileList; 