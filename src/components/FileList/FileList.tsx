import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useFileStore } from '../../stores/fileStore';
import { useRulesStore } from '../../stores/rulesStore';
import { useFileFilterStore } from '../../stores/fileFilterStore';
import MetadataPreview from './MetadataPreview';
import FileTypeFilter from './FileTypeFilter';
import { IFile } from '../../types/file';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useError } from '../../context/ErrorContext';
import { formatFileSize } from '../../utils/fileUtils';

interface FileListProps {
  searchTerm?: string;
}

interface RowData {
  files: IFile[];
  onToggleSelect: (id: string) => void;
  selectedFiles: string[];
}

// Row renderer for virtualized list
const Row = React.memo(({ data, index, style }: ListChildComponentProps<RowData>) => {
  const file = data.files[index];
  return (
    <div style={{...style, display: 'flex', alignItems: 'center'}} className={`
      ${data.selectedFiles.includes(file.id) 
        ? 'bg-blue-50 dark:bg-blue-900/20' 
        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      } cursor-pointer border-b border-gray-200 dark:border-gray-700 FileList-row
    `}>
      <div className="w-10 px-3 py-1" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          checked={data.selectedFiles.includes(file.id)}
          onChange={(e) => {
            e.stopPropagation();
            data.onToggleSelect(file.id);
          }}
        />
      </div>
      <div className="flex-1 px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
        {file.name}
      </div>
      <div className="w-32 px-3 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {file.type}
      </div>
      <div className="w-32 px-3 py-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatFileSize(file.size)}
      </div>
    </div>
  );
});

// Create a wrapper component to handle the typing issue
const VirtualizedList = React.forwardRef<any, any>((props, ref) => {
  return <FixedSizeList {...props} ref={ref} />;
});

const FileList: React.FC<FileListProps> = ({ searchTerm = '' }) => {
  const { 
    files, 
    selectedFiles, 
    selectFile, 
    deselectFile, 
    removeFiles,
    selectAll,
    deselectAll,
    clearFiles,
    setSelectedFiles,
    setFilteredFiles
  } = useFileStore();
  const { rules } = useRulesStore();
  const { isFileTypeMatched, activeFilter } = useFileFilterStore();
  const { handleError } = useError();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Filter files based on search term and file type using memoization
  const filteredFiles = useMemo(() => {
    // Ensure files is an array before filtering
    if (!Array.isArray(files)) {
      console.error('Expected files to be an array but got:', files);
      return [];
    }
    
    return files.filter(file => {
      // First, apply search term filter
      const matchesSearch = searchTerm
        ? file.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      // Then, apply file type filter using the file's type property directly
      // If file.type is undefined, use the extension from file.name
      const fileType = file.type || (file.name?.includes('.') ? file.name.split('.').pop() : undefined);
      const matchesFileType = isFileTypeMatched(file.name);
      
      // File must match both filters
      return matchesSearch && matchesFileType;
    });
  }, [files, searchTerm, isFileTypeMatched, activeFilter]);

  // Track filtered file IDs for quick lookup
  const filteredFileIds = useMemo(() => {
    return new Set(filteredFiles.map(file => file.id));
  }, [filteredFiles]);
  
  // Filter files based on the current file filter
  useEffect(() => {
    if (!files || files.length === 0) return;
    
    if (!Array.isArray(files)) {
      handleError('Expected files to be an array but got: ' + typeof files, 'error');
      return;
    }
    
    // Apply file filter
    const newFilteredFiles = useFileFilterStore.getState().filterFiles(files);
    
    // If files were filtered out, update selection to only include files in the filtered list
    const fileIds = new Set(newFilteredFiles.map(f => f.id));
    const invalidSelections = selectedFiles.filter(id => !fileIds.has(id));
    
    if (invalidSelections.length > 0) {
      // Remove invalid selections
      setSelectedFiles(selectedFiles.filter(id => fileIds.has(id)));
    }
    
    setFilteredFiles(newFilteredFiles);
  }, [files, selectedFiles, handleError, setSelectedFiles, setFilteredFiles]);

  const handleToggleSelection = (fileId: string) => {
    // Only allow toggling files that are in the filtered list
    if (filteredFiles.some(file => file.id === fileId)) {
      if (selectedFiles.includes(fileId)) {
        deselectFile(fileId);
      } else {
        selectFile(fileId);
      }
    }
  };

  // Modify select all to only select files that match the current filter
  const handleSelectAll = () => {
    const filteredFileIds = filteredFiles.map(file => file.id);
    const allFilteredAreSelected = filteredFileIds.length > 0 && 
      filteredFileIds.every(id => selectedFiles.includes(id));
    
    if (allFilteredAreSelected) {
      // If all filtered files are selected, deselect them
      removeFiles(filteredFileIds);
    } else {
      // Otherwise, select all filtered files
      selectAll();
    }
  };

  const handleClearFiles = () => {
    // Only show confirmation if there are files selected
    if (selectedFiles.length > 0) {
      setShowConfirmClear(true);
    } else {
      // Show a warning if no files are selected
      handleError('No files selected. Please select files to remove.', 'warning');
    }
  };
  
  const confirmClearFiles = () => {
    clearFiles();
    setShowConfirmClear(false);
  };
  
  const cancelClearFiles = () => {
    setShowConfirmClear(false);
  };

  const handleRowClick = (fileId: string) => {
    handleToggleSelection(fileId);
  };

  const isMetadataEnabled = rules.advanced?.metadata?.enabled;

  // Only use virtualization for large file sets
  const useVirtualization = filteredFiles.length > 200; // Increased threshold
  
  // Create a memoized list item data object to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    files: filteredFiles,
    onToggleSelect: handleToggleSelection,
    selectedFiles
  }), [filteredFiles, handleToggleSelection, selectedFiles]);

  return (
    <div className="mb-4">
      {/* Metadata Preview Section */}
      {isMetadataEnabled && <MetadataPreview />}
      
      {/* File List Controls */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-3">Files</h3>
          <FileTypeFilter />
        </div>
        <div className="space-x-2">
          <button
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleSelectAll}
          >
            {filteredFiles.length > 0 && filteredFiles.every(file => selectedFiles.includes(file.id)) 
              ? 'Unselect All' 
              : 'Select All'}
          </button>
          <button
            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={handleClearFiles}
          >
            Remove Selected
          </button>
        </div>
      </div>

      {/* File Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Showing {filteredFiles.length} of {files.length} files
        {filteredFiles.length !== files.length && ' (filtered)'}
      </div>

      {/* File List Table */}
      {files.length > 0 ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
          <div className="max-h-[calc(100vh-400px)] overflow-hidden flex flex-col">
            <div className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 flex items-center border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 px-3 py-2"></div>
              <div className="flex-1 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                File Name
              </div>
              <div className="w-32 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </div>
              <div className="w-32 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Size
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
              {useVirtualization ? (
                <VirtualizedList
                  height={Math.min(600, window.innerHeight - 500)}
                  itemCount={filteredFiles.length}
                  itemSize={35}
                  width="100%"
                  itemData={itemData}
                  className="bg-white dark:bg-gray-900"
                  overscanCount={5}
                >
                  {Row}
                </VirtualizedList>
              ) : (
                filteredFiles.map((file) => (
                  <div 
                    key={file.id}
                    className={`flex items-center ${
                      selectedFiles.includes(file.id) 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    } cursor-pointer border-b border-gray-200 dark:border-gray-700`}
                    onClick={() => handleRowClick(file.id)}
                  >
                    <div className="w-10 px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        checked={selectedFiles.includes(file.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleSelection(file.id);
                        }}
                      />
                    </div>
                    <div className="flex-1 px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {file.name}
                    </div>
                    <div className="w-32 px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {file.type}
                    </div>
                    <div className="w-32 px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No files selected. Please select files to rename.</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-3">Confirm Removing Files</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Are you sure you want to remove {selectedFiles.length} selected file{selectedFiles.length !== 1 ? 's' : ''}?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                onClick={cancelClearFiles}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={confirmClearFiles}
              >
                Remove Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList; 