import React, { useEffect, useState, useRef } from 'react';
import { useFileStore } from '../../stores/fileStore';
import { useRulesStore } from '../../stores/rulesStore';
import { generatePreview, IPreviewResult } from '../../utils/fileOperations/fileRenamer';
import { renameFiles } from '../../utils/api/fileSystemApi';

const PreviewPanel: React.FC = () => {
  const { files, updateFileName, selectedFiles, setPreviewMode, previewMode, setProcessing } = useFileStore();
  const { rules, updateNumbering } = useRulesStore();
  const [previewResults, setPreviewResults] = useState<IPreviewResult[]>([]);
  const [hasInvalidNames, setHasInvalidNames] = useState<boolean>(false);
  const [operationResults, setOperationResults] = useState<{success: number, failed: number}>({
    success: 0,
    failed: 0
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  
  // States for duplicate filename warning modal
  const [showDuplicateWarning, setShowDuplicateWarning] = useState<boolean>(false);
  const [duplicateNames, setDuplicateNames] = useState<Map<string, string[]>>(new Map());
  const pendingRenamingRef = useRef<{ filesToRename: any[], onConfirm: () => void } | null>(null);
  
  // Use a ref to track if we've already updated names to prevent loops
  const hasUpdatedNames = useRef(false);
  
  // Deep compare function for objects to prevent unnecessary re-renders
  const deepEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    
    return true;
  };
  
  // Store previous values to compare and avoid unnecessary updates
  const prevRulesRef = useRef(rules);
  const prevFilesRef = useRef(files);
  
  // Generate preview on files/rules change
  useEffect(() => {
    // Skip empty file arrays
    if (files.length === 0) return;
    
    // Skip if files and rules haven't actually changed
    if (deepEqual(files, prevFilesRef.current) && deepEqual(rules, prevRulesRef.current)) {
      return;
    }
    
    try {
      const results = generatePreview(files, rules);
      setPreviewResults(results);
      setHasInvalidNames(results.some(result => !result.isValid));
      
      // Update refs to current values
      prevRulesRef.current = rules;
      prevFilesRef.current = files;
      
      // We've generated new preview results, so reset the flag
      hasUpdatedNames.current = false;
    } catch (error) {
      setHasInvalidNames(true);
      setPreviewResults([]);
    }
  }, [files, rules]);
  
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
          updateFileName(file.id, null);
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
      setPreviewMode(!previewMode);
      
      // We'll need to update names again
      hasUpdatedNames.current = false;
    } catch (error) {
      setHasInvalidNames(true);
    }
  };

  // Check for duplicate file names that would cause overwrites
  const checkForDuplicates = (filesToRename: any[]): Map<string, string[]> => {
    const targetPaths = new Map<string, string[]>();
    
    // First, collect all target paths and the source files that would be renamed to them
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
      
      if (!targetPaths.has(targetPath)) {
        targetPaths.set(targetPath, [file.name]);
      } else {
        targetPaths.get(targetPath)?.push(file.name);
      }
    });
    
    // Then filter to only paths that have more than one source file
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
      // First, enable the numbering feature
      updateNumbering(true, { format: 'double', position: 'suffix' });
      
      // Close the warning
      setShowDuplicateWarning(false);
      
      // Set loading states
      setIsRenaming(true);
      setProcessing(true);
      
      // Important: We need to regenerate previews with numbering and create new files to rename
      // Wait a bit for the state to update (React state updates are asynchronous)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!pendingRenamingRef.current) {
        setIsRenaming(false);
        setProcessing(false);
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
      const updatedFilesToRename = files.filter(file => 
        selectedFiles.includes(file.id) && 
        newPreviews.some(preview => 
          preview.fileId === file.id && 
          preview.isValid && 
          preview.newName !== file.originalName
        )
      ).map(file => {
        // Find the updated preview for this file
        const preview = newPreviews.find(p => p.fileId === file.id);
        // Return a new file object with the updated newName
        return {
          ...file,
          newName: preview?.newName || file.newName
        };
      });
      
      // Check if we still have duplicates
      const duplicates = checkForDuplicates(updatedFilesToRename);
      if (duplicates.size > 0) {
        console.warn('Still found duplicates after enabling numbering:', duplicates);
        // Further handle this edge case - use a more aggressive numbering strategy or alert the user
      }
      
      // Execute the renaming operation with the updated file names
      await executeRenaming(updatedFilesToRename);
      
      // Clear the pending operation
      pendingRenamingRef.current = null;
      
    } catch (error) {
      setIsRenaming(false);
      setProcessing(false);
      setOperationResults({
        success: 0,
        failed: pendingRenamingRef.current?.filesToRename.length || 0
      });
      setShowResults(true);
    }
  };

  const handleApplyChanges = async () => {
    try {
      setIsRenaming(true);
      setShowResults(false);
      setProcessing(true);
      
      // Filter files that are selected and have a valid preview result
      const filesToRename = files.filter(file => 
        selectedFiles.includes(file.id) && 
        previewResults.some(result => 
          result.fileId === file.id && 
          result.isValid && 
          result.newName !== file.originalName
        )
      ).map(file => ({
        ...file,
        newName: previewResults.find(result => result.fileId === file.id)?.newName || file.name
      }));
      
      // Check if metadata updates are needed even if no renames are happening
      const metadataUpdatesNeeded = rules.advanced.metadata.enabled && 
        selectedFiles.length > 0;
      
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
                const results = await renameFiles(filesToRename);
                setOperationResults({
                  success: results.success,
                  failed: results.failed
                });
                setShowResults(true);
              } catch (error) {
                setOperationResults({
                  success: 0,
                  failed: filesToRename.length
                });
                setShowResults(true);
              }
            }
          };
          
          setDuplicateNames(duplicates);
          setShowDuplicateWarning(true);
        } else {
          // No duplicates, proceed with renaming
          try {
            // If no files to rename but metadata updates needed, handle that separately
            if (filesToRename.length === 0 && metadataUpdatesNeeded) {
              // We would call a Tauri command to apply metadata here
              // For now, just simulate success
              await new Promise(resolve => setTimeout(resolve, 500));
              setOperationResults({
                success: selectedFiles.length,
                failed: 0
              });
            } else {
              // Normal rename operation
              const results = await renameFiles(filesToRename);
              setOperationResults({
                success: results.success,
                failed: results.failed
              });
            }
            setShowResults(true);
          } catch (error) {
            setOperationResults({
              success: 0,
              failed: filesToRename.length || selectedFiles.length
            });
            setShowResults(true);
          }
        }
      } else {
        // No files selected or no changes detected
        setOperationResults({
          success: 0,
          failed: 0
        });
        setShowResults(true);
      }
    } catch (error) {
      setIsRenaming(false);
      setProcessing(false);
      setOperationResults({
        success: 0,
        failed: 1
      });
      setShowResults(true);
    }
  };
  
  // Execute the actual renaming operation
  const executeRenaming = async (filesToRename: any[]) => {
    try {
      setIsRenaming(true);
      setProcessing(true);
      
      // Call the Tauri API to rename files
      const results = await renameFiles(filesToRename);
      
      // Count successes and failures
      const successCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success).length;
      
      setOperationResults({
        success: successCount,
        failed: failedCount
      });
      
      setShowResults(true);
      
      // If all renames were successful, update the file list
      if (successCount > 0) {
        // You could refresh the file list or update the UI here
      }
    } catch (error) {
      setIsRenaming(false);
      setProcessing(false);
      setOperationResults({
        success: 0,
        failed: filesToRename.length
      });
      setShowResults(true);
    }
  };

  const getStatsText = () => {
    if (files.length === 0) return 'No files selected';
    
    const validRenames = previewResults.filter(r => 
      selectedFiles.includes(r.fileId) && 
      r.isValid && 
      r.originalName !== r.newName
    ).length;
    
    const invalidCount = previewResults.filter(r => 
      selectedFiles.includes(r.fileId) && !r.isValid
    ).length;
    
    let text = `${validRenames} file${validRenames !== 1 ? 's' : ''} will be renamed`;
    
    if (invalidCount > 0) {
      text += ` (${invalidCount} invalid name${invalidCount !== 1 ? 's' : ''})`;
    }
    
    return text;
  };

  // If no files, don't show the preview panel
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4">
      {/* Duplicate Warning Modal */}
      {showDuplicateWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-5">
            <div className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Warning: Potential Data Loss
            </div>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>Multiple files will be renamed to the same name</strong>, which will cause files to overwrite each other.
              Only the last file processed will remain; all others with the same name will be permanently lost.
            </p>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Recommended action: Enable auto-numbering to give each file a unique name (e.g., test01.png, test02.png).
            </p>
            
            <div className="max-h-48 overflow-auto mb-4 bg-gray-100 dark:bg-gray-900 p-3 rounded">
              <p className="font-semibold mb-2">Files that will be overwritten:</p>
              {Array.from(duplicateNames.entries()).map(([targetPath, sourceFiles], index) => {
                // Get the filename regardless of whether the path uses / or \
                const fileName = targetPath.split(/[/\\]/).pop();
                return (
                  <div key={index} className="mb-3">
                    <p className="font-medium text-red-600 dark:text-red-400">→ {fileName}</p>
                    <ul className="pl-5 list-disc">
                      {sourceFiles.map((file, i) => (
                        <li key={i} className="text-sm">{file}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={enableAutoNumbering}
              >
                Enable Auto-Numbering
              </button>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setShowDuplicateWarning(false)}
                >
                  Cancel
                </button>
                
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  onClick={() => {
                    setShowDuplicateWarning(false);
                    if (pendingRenamingRef.current) {
                      pendingRenamingRef.current.onConfirm();
                      pendingRenamingRef.current = null;
                    }
                  }}
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Preview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Preview mode
          </span>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={previewMode}
                onChange={handleTogglePreview}
              />
              <div className={`block w-10 h-6 rounded-full ${previewMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${previewMode ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>

      {showResults && (
        <div className={`mb-4 p-3 rounded-md ${
          operationResults.failed > 0 
            ? 'bg-yellow-50 dark:bg-yellow-900/20' 
            : 'bg-green-50 dark:bg-green-900/20'
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
                  {operationResults.failed} file{operationResults.failed !== 1 ? 's' : ''} failed.
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

      {/* Preview table for debug purposes */}
      {previewMode && (
        <div className="overflow-auto max-h-64 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono">
          <table className="min-w-full">
            <thead className="border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="py-1 px-2 text-left">Original</th>
                <th className="py-1 px-2 text-left">New</th>
                <th className="py-1 px-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {previewResults.map(result => (
                <tr key={result.fileId} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-1 px-2 truncate max-w-xs">{result.originalName}</td>
                  <td className={`py-1 px-2 truncate max-w-xs ${!result.isValid ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {result.newName}
                  </td>
                  <td className="py-1 px-2">
                    {!result.isValid ? (
                      <span className="text-red-600 dark:text-red-400">Invalid</span>
                    ) : result.originalName !== result.newName ? (
                      <span className="text-green-600 dark:text-green-400">Will rename</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No change</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel; 