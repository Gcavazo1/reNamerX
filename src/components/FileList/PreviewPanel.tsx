import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFileStore } from '../../stores/fileStore';
import { useRulesStore } from '../../stores/rulesStore';
import { useFileFilterStore } from '../../stores/fileFilterStore';
import { generatePreview, IPreviewResult } from '../../utils/fileOperations/fileRenamer';
import { renameFiles } from '../../utils/api/fileSystemApi';
import { useError } from '../../context/ErrorContext';
import { FileSystemError, FileSystemErrorType } from '../../utils/api/fileSystemError';
import { IFile } from '../../types/file';
import { ErrorSeverity } from '../../types/error';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useHistoryStore, RenameRecord } from '../../stores/historyStore';
import { motion } from 'framer-motion';
import { isValidFileName } from '../../utils/validators/fileNameValidator';
import { pathUtils } from '../../utils/fileUtils';

interface OperationResults {
  success: number;
  failed: number;
}

interface FloatingWindowProps {
  children: React.ReactNode;
  onDock: () => void;
  onClose: () => void;
  title: string;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ children, onDock, onClose, title }) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 4, y: window.innerHeight / 4 });
  const [size, setSize] = useState({ width: 600, height: 500 });
  const nodeRef = useRef(null);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <Draggable
          nodeRef={nodeRef}
          position={position}
          onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
          handle=".floating-window-handle"
          bounds="parent"
        >
          <div ref={nodeRef} style={{ position: 'absolute', width: size.width, height: size.height }}>
            <ResizableBox
              width={size.width}
              height={size.height}
              minConstraints={[400, 300]}
              maxConstraints={[window.innerWidth - 100, window.innerHeight - 100]}
              onResize={(e, { size: newSize }) => {
                setSize({ width: newSize.width, height: newSize.height });
              }}
              resizeHandles={['se']}
              handle={<div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent" />}
            >
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-full h-full flex flex-col">
                <div className="floating-window-handle flex items-center justify-between p-1 bg-gray-100 dark:bg-gray-700 rounded-t-lg cursor-move select-none">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{title}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={onDock}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      title="Dock window"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </button>
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      title="Close window"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-3">
                  {children}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity">
                  <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 16v-1.5h-1.5V16H16zm-3 0v-1.5h-1.5V16H13zm-3 0v-1.5h-1.5V16H10zm6-3v-1.5h-1.5V13H16zm-3 0v-1.5h-1.5V13H13zm-3 0v-1.5h-1.5V13H10zm6-3v-1.5h-1.5V10H16zm-3 0v-1.5h-1.5V10H13zm-3 0v-1.5h-1.5V10H10z" />
                  </svg>
                </div>
              </div>
            </ResizableBox>
          </div>
        </Draggable>
      </div>
    </div>
  );
};

const PreviewPanel: React.FC = () => {
  const { files, updateFileName, selectedFiles, setPreviewMode, previewMode, setProcessing, setFiles, setSelectedFiles } = useFileStore();
  const { rules, updateNumbering } = useRulesStore();
  const { isFileTypeMatched, activeFilter } = useFileFilterStore();
  const { handleError } = useError();
  const { addRename } = useHistoryStore();
  const [previewResults, setPreviewResults] = useState<IPreviewResult[]>([]);
  const [hasInvalidNames, setHasInvalidNames] = useState<boolean>(false);
  const [operationResults, setOperationResults] = useState<OperationResults>({ success: 0, failed: 0 });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  
  // States for duplicate filename warning modal
  const [showDuplicateWarning, setShowDuplicateWarning] = useState<boolean>(false);
  const [duplicateNames, setDuplicateNames] = useState<Map<string, string[]>>(new Map());
  const pendingRenamingRef = useRef<{ filesToRename: IFile[], onConfirm: () => void } | null>(null);
  
  // Use a ref to track if we've already updated names to prevent loops
  const hasUpdatedNames = useRef(false);
  
  // Ref for timeout to handle batched preview generation
  const previewTimeoutRef = useRef<number | null>(null);
  
  // Get filtered files
  const filteredFiles = React.useMemo(() => {
    // Ensure files is an array before filtering
    if (!Array.isArray(files)) {
      console.error('Expected files to be an array but got:', files);
      return [];
    }
    
    return files.filter(file => {
      const fileType = file.type || (file.name?.includes('.') ? file.name.split('.').pop() : undefined);
      return isFileTypeMatched(file.name);
    });
  }, [files, isFileTypeMatched, activeFilter]);
  
  // Get IDs of filtered files for quick lookups
  const filteredFileIds = React.useMemo(() => {
    return new Set(filteredFiles.map(file => file.id));
  }, [filteredFiles]);
  
  // Generate preview when rules or files change
  useEffect(() => {
    if (files.length === 0) return;
    
    // Don't generate preview if there are no rules enabled
    const hasEnabledRules = 
      rules.caseTransformation.enabled || 
      rules.numbering.enabled || 
      rules.textOperations.findReplace.enabled ||
      rules.textOperations.prefix.enabled ||
      rules.textOperations.suffix.enabled ||
      rules.textOperations.removeChars.enabled ||
      rules.advanced.dateStamp.enabled ||
      rules.advanced.metadata.enabled;
      
    if (!hasEnabledRules) {
      setPreviewResults([]);
      return;
    }
    
    // Cancel any pending operation
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    
    console.log('Generating preview for filtered and selected files');
    setProcessing(true);
    
    // Only process files that are both in the current filter AND selected (if any selections exist)
    const filesToProcess = selectedFiles.length > 0 
      ? filteredFiles.filter(file => selectedFiles.includes(file.id))
      : filteredFiles;
    
    console.log(`Generating preview for ${filesToProcess.length} files (${filteredFiles.length} filtered, ${selectedFiles.length} selected)`);
    
    try {
      // Process all files at once to maintain sequential numbering
      const results = generatePreview(filesToProcess, rules);
      setPreviewResults(results);
      console.log(`Completed preview generation for ${filesToProcess.length} files`);
    } catch (error) {
      handleError(`Failed to generate preview: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setProcessing(false);
    }
    
    // Cleanup function
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [files, rules, selectedFiles, filteredFiles, handleError]);
  
  // Handle applying preview names
  useEffect(() => {
    // Skip if we've already updated names for this preview
    if (hasUpdatedNames.current) return;
    
    // Skip if there are no files or preview results
    if (files.length === 0 || previewResults.length === 0) return;
    
    try {
      if (previewMode) {
        previewResults.forEach(result => {
          if (result.isValid) {
            updateFileName(result.fileId, result.newName);
          }
        });
      } else {
        files.forEach(file => {
          updateFileName(file.id, ""); // Use empty string instead of null
        });
      }
      
      // Mark that we've updated names for this preview
      hasUpdatedNames.current = true;
    } catch (error) {
      setHasInvalidNames(true);
    }
  }, [previewMode, previewResults, files, updateFileName]);

  const handleTogglePreview = () => {
    try {
      // Set the preview mode to the opposite of current mode
      const newMode = previewMode === 'side-by-side' ? 'list' : 'side-by-side';
      setPreviewMode(newMode);
      
      // Reset the 'has updated names' flag so that preview can be re-computed
      hasUpdatedNames.current = false;
    } catch (error) {
      console.error('Error toggling preview mode:', error);
    }
  };

  // Check for duplicate file names that would cause overwrites
  const checkForDuplicates = (filesToRename: IFile[]): Map<string, string[]> => {
    const targetPaths = new Map<string, string[]>();
    // Track original paths to handle self-renaming
    const originalPathMap = new Map<string, string>();

    // First, map each file's original path for quick lookups
    filesToRename.forEach(file => {
      originalPathMap.set(file.path.toLowerCase(), file.path);
    });
    
    // Then, collect all target paths and the source files that would be renamed to them
    filesToRename.forEach(file => {
      // Extract directory path from original path
      const path = file.path;
      const lastSeparatorIndex = Math.max(
        path.lastIndexOf('/'), 
        path.lastIndexOf('\\')
      );
      const dirPath = path.substring(0, lastSeparatorIndex + 1);
      
      // Build target path by joining directory with new name
      const targetPath = `${dirPath}${file.newName}`;
      const targetPathLower = targetPath.toLowerCase();
      
      // Skip if this is essentially self-renaming (only changing case)
      const originalPathLower = path.toLowerCase();
      if (targetPathLower === originalPathLower) {
        console.log(`Skipping self-rename detection for ${file.name} -> ${file.newName}`);
        return;
      }
      
      if (!targetPaths.has(targetPathLower)) {
        targetPaths.set(targetPathLower, [file.name]);
      } else {
        targetPaths.get(targetPathLower)?.push(file.name);
      }
    });
    
    // Check for conflicts with existing files in the directory that aren't part of the rename operation
    const allOriginalPaths = new Set(filesToRename.map(file => file.path.toLowerCase()));
    
    filesToRename.forEach(file => {
      const path = file.path;
      const lastSeparatorIndex = Math.max(
        path.lastIndexOf('/'), 
        path.lastIndexOf('\\')
      );
      const dirPath = path.substring(0, lastSeparatorIndex + 1);
      const targetPath = `${dirPath}${file.newName}`;
      const targetPathLower = targetPath.toLowerCase();
      
      // Skip self-renaming (only case changing)
      if (targetPathLower === path.toLowerCase()) {
        return;
      }
      
      // Check if target would conflict with files not being renamed
      const targetExists = files.some(f => 
        f.path.toLowerCase() === targetPathLower && 
        !allOriginalPaths.has(f.path.toLowerCase()) &&
        !selectedFiles.includes(f.id)
      );
      
      if (targetExists) {
        // This will overwrite an existing file that isn't part of the rename operation
        if (!targetPaths.has(targetPathLower)) {
          targetPaths.set(targetPathLower, [file.name]);
        } else if (!targetPaths.get(targetPathLower)?.includes(file.name)) {
          targetPaths.get(targetPathLower)?.push(file.name);
        }
      }
    });
    
    // Filter to only paths that have more than one source file
    // (which means multiple files would be renamed to the same name)
    const duplicates = new Map<string, string[]>();
    targetPaths.forEach((sourceFiles, targetPath) => {
      if (sourceFiles.length > 1) {
        duplicates.set(targetPath, sourceFiles);
      }
    });
    
    return duplicates;
  };

  // Enable auto-numbering to avoid duplicates
  const enableAutoNumbering = async () => {
    try {
      // First, enable the numbering feature with a double-digit format (01, 02, etc.)
      updateNumbering(true, { 
        format: 'double', 
        position: 'suffix',
        start: 1,  // Explicitly start at 1
        increment: 1  // Ensure increment is 1 to avoid gaps
      });
      
      // Close the warning
      setShowDuplicateWarning(false);
      
      // Set loading states
      setIsRenaming(true);
      setProcessing(true);
      
      // Important: We need to regenerate previews with numbering and create new files to rename
      // Wait a bit for the state to update (React state updates are asynchronous)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!pendingRenamingRef.current) {
        setOperationResults({
          success: 0,
          failed: 1
        });
        setShowResults(true);
        return;
      }
      
      // Get the current files that were going to be renamed
      const { filesToRename } = pendingRenamingRef.current;
      
      // Generate new previews with numbering enabled
      const newPreviews = generatePreview(files, rules);
      
      // Create a new list of files to rename with the updated names that now include numbers
      // Maintain the original order of the files to ensure sequential numbering
      const updatedFilesToRename = filesToRename.map((file, index) => {
        // Find the updated preview for this file
        const preview = newPreviews.find(p => p.fileId === file.id);
        // Return a new file object with the updated newName
        return {
          ...file,
          newName: preview?.newName || file.newName,
          // Store the original index to maintain ordering
          originalIndex: index
        };
      });
      
      // Check if we still have duplicates
      const duplicates = checkForDuplicates(updatedFilesToRename);
      if (duplicates.size > 0) {
        console.warn('Still found duplicates after enabling numbering:', duplicates);
        
        // Try with triple digit format (001, 002, etc.) for more uniqueness
        updateNumbering(true, { 
          format: 'triple',
          position: 'suffix',
          start: 1,
          increment: 1
        });
        
        // Wait for state update and regenerate previews
        await new Promise(resolve => setTimeout(resolve, 200));
        const tripleDigitPreviews = generatePreview(files, rules);
        
        // Update with triple digit names
        updatedFilesToRename.forEach(file => {
          const preview = tripleDigitPreviews.find(p => p.fileId === file.id);
          if (preview) {
            file.newName = preview.newName;
          }
        });
      }
      
      // Execute the renaming operation with the updated file names
      // Make sure to sort by original index to maintain ordering
      const sortedFilesToRename = [...updatedFilesToRename].sort((a, b) => 
        (a.originalIndex || 0) - (b.originalIndex || 0)
      );
      
      await executeRenaming(sortedFilesToRename);
      
      // Clear the pending operation
      pendingRenamingRef.current = null;
      
    } catch (error) {
      if (error instanceof FileSystemError) {
        handleError(error.message, 'warning', error.originalError?.stack);
      } else {
        handleError(
          `Error in auto numbering: ${error instanceof Error ? error.message : String(error)}`,
          'error',
          error instanceof Error ? error.stack : undefined
        );
      }
      
      setOperationResults({
        success: 0,
        failed: pendingRenamingRef.current?.filesToRename.length || 0
      });
      setShowResults(true);
    } finally {
      setIsRenaming(false);
      setProcessing(false);
    }
  };

  // Helper function for handling rename errors consistently
  const handleRenameError = (error: unknown, fileCount: number) => {
    console.error("Rename operation error:", error);
    
    let message = 'Failed to rename files';
    let severity: ErrorSeverity = 'error';
    let stack: string | undefined;
    
    if (error instanceof FileSystemError) {
      // For large batches, create a truncated message to prevent UI issues
      const errorMessage = fileCount > 100 
        ? `${error.message.substring(0, 100)}... (and more errors)`
        : error.message;
      
      message = `Rename operation failed: ${errorMessage}`;
      severity = error.type === FileSystemErrorType.PERMISSION_DENIED ? 'error' : 'warning';
      stack = error.originalError?.stack;
    } else if (error instanceof Error) {
      // For large batches, create a truncated message to prevent UI issues
      const errorMessage = fileCount > 100 
        ? `${error.message.substring(0, 100)}... (and more errors)`
        : error.message;
      
      message = `Failed to rename files: ${errorMessage}`;
      stack = error.stack;
    } else {
      const errorStr = String(error);
      // For large batches, create a truncated message to prevent UI issues
      const errorMessage = fileCount > 100 && errorStr.length > 100
        ? `${errorStr.substring(0, 100)}... (and more errors)`
        : errorStr;
      
      message = `Failed to rename files: ${errorMessage}`;
    }
    
    handleError(message, severity, stack);
    
    // Always show results after operation completes
    setOperationResults({
      success: 0,
      failed: fileCount
    });
    setShowResults(true);
  };

  const handleApplyChanges = async () => {
    try {
      setIsRenaming(true);
      setShowResults(false);
      setProcessing(true);
      
      // Get files that are in the current filter
      const filesToProcess = selectedFiles.length > 0
        ? filteredFiles.filter(file => selectedFiles.includes(file.id))
        : filteredFiles;
      
      if (filesToProcess.length === 0) {
        handleError('No files to rename. Make sure you have files selected that match the current filter.', 'warning');
        setOperationResults({ success: 0, failed: 0 });
        setShowResults(true);
        setIsRenaming(false);
        setProcessing(false);
        return;
      }
      
      // Filter files that have a valid preview result with a new name
      const filesToRename = filesToProcess
        .filter(file => 
          previewResults.some(result => 
            result.fileId === file.id && 
            result.isValid && 
            result.newName !== file.name
          )
        )
        .map((file, index) => ({
          ...file,
          newName: previewResults.find(result => result.fileId === file.id)?.newName || file.name,
          originalIndex: index
        }));
      
      // Check if metadata updates are needed even if no renames are happening
      const metadataUpdatesNeeded = rules.advanced.metadata.enabled && filesToProcess.length > 0;
      
      // If there are no files to rename and no metadata to update, show a message
      if (filesToRename.length === 0 && !metadataUpdatesNeeded) {
        handleError('No changes to apply. Make sure you have enabled some renaming rules.', 'warning');
        setOperationResults({ success: 0, failed: 0 });
        setShowResults(true);
        setIsRenaming(false);
        setProcessing(false);
        return;
      }
      
      console.log(`Applying changes to ${filesToRename.length} files of ${filesToProcess.length} filtered files`);
      
      // If we have files to rename, or if we have metadata updates but no files to rename
      if (filesToRename.length > 0 || metadataUpdatesNeeded) {
        // Check for potential duplicates that would cause overwrites
        const duplicates = checkForDuplicates(filesToRename);
        
        if (duplicates.size > 0) {
          // Store the pending operation so we can execute it after user confirmation
          pendingRenamingRef.current = {
            filesToRename,
            onConfirm: async () => {
              try {
                // Make sure to sort by original index to maintain ordering
                const sortedFilesToRename = [...filesToRename].sort((a, b) => 
                  (a.originalIndex || 0) - (b.originalIndex || 0)
                );
                
                // Transform files to format expected by renameFiles
                await executeRenaming(sortedFilesToRename);
                
                // Always show results after operation completes
                setShowResults(true);
                // Dock the preview panel after successful rename
                setIsUndocked(false);
              } catch (error) {
                handleRenameError(error, filesToRename.length);
              } finally {
                setIsRenaming(false);
                setProcessing(false);
              }
            }
          };
          
          setDuplicateNames(duplicates);
          setShowDuplicateWarning(true);
          setIsRenaming(false);
          setProcessing(false);
          return;
        }
        
        // If no duplicates, proceed with renaming
        try {
          // Make sure to sort by original index to maintain ordering
          const sortedFilesToRename = [...filesToRename].sort((a, b) => 
            (a.originalIndex || 0) - (b.originalIndex || 0)
          );
          
          await executeRenaming(sortedFilesToRename);
          
          // Always show results after operation completes
          setShowResults(true);
          // Dock the preview panel after successful rename
          setIsUndocked(false);
        } catch (error) {
          handleRenameError(error, filesToRename.length);
        }
      } else {
        // No files selected or no changes detected
        setOperationResults({
          success: 0,
          failed: 0
        });
        setShowResults(true);
        setIsRenaming(false);
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error in handleApplyChanges:", error);
      handleRenameError(error, selectedFiles.length);
    } finally {
      setIsRenaming(false);
      setProcessing(false);
    }
  };
  
  // Execute the file renaming operation
  const executeRenaming = useCallback(async (filesToRename: IFile[]): Promise<{ success: string[], failed: string[] }> => {
    try {
      // Create pairs of files to rename (old -> new)
      const renamePairs = filesToRename
        .filter(file => {
          // Skip files without new names or with invalid names
          if (!file.newName) {
            console.log(`Skipping file ${file.id} (${file.name}) - no new name provided`);
            return false;
          }

          if (!isValidFileName(file.newName)) {
            console.log(`Skipping file ${file.id} (${file.name}) - invalid new name: ${file.newName}`);
            return false;
          }

          if (file.name === file.newName) {
            console.log(`Skipping file ${file.id} (${file.name}) - name hasn't changed`);
            return false;
          }
          
          return true;
        })
        .map(file => ({
          id: file.id,
          oldName: file.name,
          newName: file.newName as string // We've filtered out nulls
        }));

      if (renamePairs.length === 0) {
        console.warn('No valid files to rename');
        handleError('No valid files to rename', 'info');
        setOperationResults({
          success: 0,
          failed: 0
        });
        return { success: [], failed: [] };
      }

      console.log(`Sending ${renamePairs.length} rename pairs to the API`);
      const result = await renameFiles(renamePairs);
      console.log(`Rename result:`, result);
      
      // Create a set of successfully renamed file IDs for quick lookup
      const renamedFileIds = new Set(result.success);
      console.log(`Successfully renamed ${result.success.length} files`, renamedFileIds);
      
      // Show success message with appropriate sizing for large batches
      if (result.success.length > 0) {
        const successMessage = 
          result.failed.length > 0
            ? `${result.success.length} files renamed successfully, ${result.failed.length} failed`
            : `${result.success.length} files renamed successfully`;
            
        handleError(successMessage, 'info');
        
        // Create rename records for history
        const timestamp = Date.now();
        const renameRecords = files
          .filter(file => renamedFileIds.has(file.id))
          .map(file => {
            // Find the corresponding rename pair
            const rename = renamePairs.find(r => r.id === file.id);
            if (!rename) return null;
            
            // Get correct absolute paths
            const currentPath = file.path;
            const dirPath = pathUtils.dirname(currentPath);
            const newPath = pathUtils.join(dirPath, rename.newName);
            
            // Log the paths to ensure they're correct
            console.log(`Adding history record for ${file.id}:`, {
              oldPath: currentPath,
              oldName: file.name,
              newPath: newPath,
              newName: rename.newName
            });
            
            return {
              id: file.id,
              oldPath: currentPath,
              oldName: file.name,
              newPath: newPath,
              newName: rename.newName,
              timestamp
            };
          })
          .filter(Boolean) as RenameRecord[];
        
        // Add to history
        if (renameRecords.length > 0) {
          addRename(renameRecords);
          console.log(`Added ${renameRecords.length} rename records to history`);
        }
      } else if (result.failed.length > 0) {
        handleError(`Failed to rename ${result.failed.length} files`, 'warning');
      }
      
      // Set operation results for display
      setOperationResults({
        success: result.success.length,
        failed: result.failed.length
      });
      
      // Update file store to reflect renamed files
      if (result.success.length > 0) {
        // Clear files after a brief delay to allow users to see the success message
        setTimeout(() => {
          console.log('Clearing files after successful rename');
          setFiles([]);
        }, 2000);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error during renaming operation:", error);
      
      handleError(
        `Failed to rename files: ${errorMessage}`,
        'error'
      );
      
      setOperationResults({
        success: 0,
        failed: filesToRename.length
      });
      
      return { success: [], failed: filesToRename.map(f => f.id) };
    }
  }, [
    renameFiles,
    handleError,
    setFiles,
    setOperationResults,
    isValidFileName,
    files,
    addRename
  ]);

  const getStatsText = () => {
    if (files.length === 0) return 'No files selected';
    
    const selectedCount = selectedFiles.length;
    
    const validRenames = previewResults.filter(r => 
      selectedFiles.includes(r.fileId) && 
      r.isValid && 
      r.originalName !== r.newName
    ).length;
    
    const invalidCount = previewResults.filter(r => 
      selectedFiles.includes(r.fileId) && !r.isValid
    ).length;
    
    let text = `${selectedCount} of ${files.length} files selected, ${validRenames} file${validRenames !== 1 ? 's' : ''} will be renamed`;
    
    if (invalidCount > 0) {
      text += ` (${invalidCount} invalid name${invalidCount !== 1 ? 's' : ''})`;
    }
    
    return text;
  };

  const renderPreviewTable = () => {
    // Only show preview for selected files
    if (selectedFiles.length === 0) {
      return (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          No files selected. Please select files to preview renamed files.
        </div>
      );
    }
    
    // Filter preview results to show only selected files
    const filesToDisplay = previewResults.filter(result => selectedFiles.includes(result.fileId));
    
    if (filesToDisplay.length === 0) {
      return (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          No files selected match the current filter.
        </div>
      );
    }
    
    return (
      <div className="preview-table max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/2">
                Original
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/2">
                New
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filesToDisplay.map(result => (
              <tr key={result.fileId} className={!result.isValid ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 truncate">
                  {result.originalName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 dark:text-green-400 truncate">
                  {result.newName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  {result.isValid ? (
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                      Will be renamed
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                      Invalid name
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const [isUndocked, setIsUndocked] = useState(false);

  // Add handler for undocking/docking
  const handleUndock = () => {
    setIsUndocked(true);
  };

  const handleDock = () => {
    setIsUndocked(false);
  };

  const handleClose = () => {
    setIsUndocked(false);
  };

  // If no files, don't show the preview panel
  if (files.length === 0) {
    return null;
  }

  const previewContent = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Preview <span className="text-sm text-gray-600 dark:text-gray-400">(only selected files will be renamed)</span></h2>
        <div className="flex items-center space-x-2">
          {!isUndocked && (
            <button
              onClick={handleUndock}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Undock window"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Preview mode
          </span>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={previewMode === 'side-by-side'}
                onChange={handleTogglePreview}
              />
              <div className={`block w-10 h-6 rounded-full ${previewMode === 'side-by-side' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${previewMode === 'side-by-side' ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>

      {showResults && (
        <div className={`mb-4 p-3 rounded-md ${
          operationResults.failed > 0 
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
            : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {operationResults.success > 0 && (
                <span className="text-green-700 dark:text-green-400">
                  {operationResults.success} file{operationResults.success !== 1 ? 's' : ''} renamed successfully.
                </span>
              )}
              {operationResults.failed > 0 && (
                <span className="text-red-700 dark:text-red-400 ml-2">
                  {operationResults.failed} file{operationResults.failed !== 1 ? 's' : ''} failed to rename.
                </span>
              )}
              {operationResults.success === 0 && operationResults.failed === 0 && (
                <span className="text-gray-700 dark:text-gray-400">
                  No files were renamed. Check your selection and rules.
                </span>
              )}
            </span>
            <button
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => setShowResults(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 p-3 rounded-md bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getStatsText()}
          </span>
          <button
            className={`px-4 py-1.5 ${isRenaming ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            onClick={handleApplyChanges}
            disabled={isRenaming || (selectedFiles.length === 0) || (hasInvalidNames && !rules.advanced.metadata.enabled)}
          >
            {isRenaming ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply Changes
              </>
            )}
          </button>
        </div>
        
        {hasInvalidNames && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-sm">
            <strong>Warning:</strong> Some file names are invalid. Please review your renaming rules.
          </div>
        )}
      </div>

      {/* Preview table */}
      {previewMode !== 'list' && renderPreviewTable()}
    </>
  );

  if (isUndocked) {
    return (
      <FloatingWindow
        title="File Preview"
        onDock={handleDock}
        onClose={handleClose}
      >
        {previewContent}
      </FloatingWindow>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4">
      {previewContent}
    </div>
  );
};

// Wrap the component with observer for MobX reactivity
export default observer(PreviewPanel); 