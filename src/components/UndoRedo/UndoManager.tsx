import React, { useState } from 'react';
import { useHistoryStore, RenameRecord } from '../../stores/historyStore';
import { useFileStore } from '../../stores/fileStore';
import { useError } from '../../context/ErrorContext';

// Simple UndoManager that only handles file rename operations
const UndoManager: React.FC = () => {
  const { renameHistory, undoLastRename, canUndo, clearHistory } = useHistoryStore();
  const { undoRename } = useFileStore();
  const { handleError } = useError();
  
  const [isUndoing, setIsUndoing] = useState(false);
  
  // Function to handle undoing the last rename operation
  const handleUndo = async () => {
    if (!canUndo() || isUndoing) return;
    
    try {
      setIsUndoing(true);
      
      // Get the last renames to undo
      const renames = undoLastRename();
      if (!renames || renames.length === 0) {
        handleError('No rename operations to undo', 'info');
        return;
      }
      
      console.log(`Undoing ${renames.length} file renames`);
      
      // Show a status notification for large batches
      if (renames.length > 100) {
        handleError(`Undoing ${renames.length} renames. This may take a moment...`, 'info');
      }
      
      // Actually perform the undo
      const [successIds, failedIds] = await undoRename(renames);
      
      // Show success or failure message
      if (successIds.length > 0) {
        const message = failedIds.length > 0 
          ? `Successfully undid ${successIds.length} file renames, but ${failedIds.length} failed` 
          : `Successfully undid ${successIds.length} file renames`;
        
        handleError(message, 'info');
      } else {
        handleError('Failed to undo file renames', 'warning');
      }
    } catch (error) {
      console.error('Error during undo operation:', error);
      
      // Truncate error message if it's too long
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.length > 100) {
        errorMessage = `${errorMessage.substring(0, 100)}... (and more)`;
      }
      
      handleError(`Undo failed: ${errorMessage}`, 'error');
    } finally {
      setIsUndoing(false);
    }
  };
  
  // Determine button state based on history
  const hasRenames = renameHistory.length > 0;
  const latestBatch = hasRenames ? 
    renameHistory.filter(r => r.timestamp === renameHistory[0].timestamp) : 
    [];
  
  // Count how many renames are in the latest batch
  const renameCount = latestBatch.length;
  
  // Format the button text - truncate if very large
  const buttonText = hasRenames 
    ? renameCount > 999 
      ? 'Undo Batch' 
      : `Undo ${renameCount} ${renameCount === 1 ? 'Rename' : 'Renames'}`
    : 'No Renames to Undo';
  
  // More detailed tooltip text
  const tooltipText = hasRenames 
    ? `Click to undo ${renameCount} file renames from last operation`
    : 'No renames to undo';
  
  return (
    <div className="flex items-center">
      <button
        className={`px-3 py-1.5 rounded flex items-center space-x-1.5 
          ${hasRenames && !isUndoing 
            ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300' 
            : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'}`}
        onClick={handleUndo}
        disabled={!hasRenames || isUndoing}
        title={tooltipText}
      >
        {isUndoing ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Undoing...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>{buttonText}</span>
            {renameCount > 100 && (
              <span className="text-xs ml-1 opacity-75">(Large Batch)</span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default UndoManager; 