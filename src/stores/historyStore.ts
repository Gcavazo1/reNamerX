import { create } from 'zustand';
import { useFileStore } from './fileStore';

// Maximum number of operations to keep in history across all batches
// This limits total memory usage if someone does many operations
const MAX_HISTORY_LENGTH = 1000;

// Define the structure of a rename record
export interface RenameRecord {
  id: string;        // Unique identifier for the file
  oldPath: string;   // Original file path before rename
  oldName: string;   // Original file name before rename
  newPath: string;   // New file path after rename
  newName: string;   // New file name after rename
  timestamp: number; // When the rename operation happened
}

export interface HistoryState {
  // Only store rename operations
  renameHistory: RenameRecord[];
  redoStack: RenameRecord[][]; // Stack of operations that were undone for potential redo
  
  // Operations
  addRename: (renames: RenameRecord[]) => void;
  undoLastRename: () => RenameRecord[] | null;
  redoLastUndo: () => RenameRecord[] | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  trackFailedUndos: (failedIds: string[]) => void;
  getBatchSize: () => number;
  
  // Higher-level operations that handle the file system calls
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  
  // Backward compatibility function - does nothing now
  addToHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  renameHistory: [],
  redoStack: [],
  
  // Add rename operations to history
  addRename: (renames) => set(state => {
    if (!renames || renames.length === 0) return state;
    
    console.log(`Adding ${renames.length} renames to history`);
    
    // Adding new operations should clear the redo stack
    return {
      renameHistory: [...renames, ...state.renameHistory].slice(0, MAX_HISTORY_LENGTH),
      redoStack: [] // Clear redo stack when new operations are performed
    };
  }),
  
  // Undo the last rename operation
  undoLastRename: () => {
    const { renameHistory, redoStack } = get();
    
    if (renameHistory.length === 0) {
      console.log('No rename operations to undo');
      return null;
    }
    
    // Get renames from the most recent batch (they were added together)
    const firstTimestamp = renameHistory[0].timestamp;
    const renamesToUndo = renameHistory.filter(r => r.timestamp === firstTimestamp);
    
    // Add these operations to the redo stack
    set({
      renameHistory: renameHistory.slice(renamesToUndo.length),
      redoStack: [...redoStack, renamesToUndo]
    });
    
    console.log(`Returning ${renamesToUndo.length} renames to undo`);
    return renamesToUndo;
  },
  
  // Redo the last undone rename operation
  redoLastUndo: () => {
    const { redoStack } = get();
    
    if (redoStack.length === 0) {
      console.log('No operations to redo');
      return null;
    }
    
    // Get the last batch of undone operations
    const lastBatch = redoStack[redoStack.length - 1];
    
    // Remove this batch from the redo stack
    set(state => ({
      redoStack: state.redoStack.slice(0, state.redoStack.length - 1)
    }));
    
    console.log(`Returning ${lastBatch.length} renames to redo`);
    return lastBatch;
  },
  
  // Handle case where some undo operations failed - add them back to history
  trackFailedUndos: (failedIds: string[]) => {
    if (!failedIds || failedIds.length === 0) return;
    
    console.log(`Tracking ${failedIds.length} failed undo operations`);
    
    set(state => {
      // Find the records that failed to undo in our removed set
      const currentTime = Date.now();
      const failedRenames = state.renameHistory
        .filter(record => failedIds.includes(record.id))
        .map(record => ({
          ...record,
          timestamp: currentTime // Update timestamp to make this the newest batch
        }));
      
      if (failedRenames.length === 0) return state;
      
      console.log(`Adding ${failedRenames.length} failed renames back to history`);
      
      // Add failed renames back to the beginning of history
      return {
        renameHistory: [...failedRenames, ...state.renameHistory].slice(0, MAX_HISTORY_LENGTH)
      };
    });
  },
  
  // Get the size of the current batch to undo
  getBatchSize: () => {
    const { renameHistory } = get();
    
    if (renameHistory.length === 0) {
      return 0;
    }
    
    // Count entries with the same timestamp as the first entry
    const firstTimestamp = renameHistory[0].timestamp;
    return renameHistory.filter(r => r.timestamp === firstTimestamp).length;
  },
  
  // Check if there are any operations to undo
  canUndo: () => {
    return get().renameHistory.length > 0;
  },

  // Check if there are any operations to redo
  canRedo: () => {
    return get().redoStack.length > 0;
  },
  
  // Clear all history
  clearHistory: () => set({
    renameHistory: [],
    redoStack: []
  }),
  
  // Higher-level undo operation that handles file system calls
  undo: async () => {
    console.log('Attempting to undo last operation');
    const undoRenames = get().undoLastRename();
    
    if (!undoRenames || undoRenames.length === 0) {
      console.log('Nothing to undo');
      return;
    }
    
    try {
      // Reverse the renames by passing the undo records to the file store's undoRename function
      await useFileStore.getState().undoRename(undoRenames);
      console.log('Successfully undid renaming operation');
    } catch (error) {
      console.error('Error during undo operation:', error);
      // If there's an error, add the failed renames back to history
      get().addRename(undoRenames);
    }
  },
  
  // Higher-level redo operation that handles file system calls
  redo: async () => {
    console.log('Attempting to redo last undone operation');
    const redoRenames = get().redoLastUndo();
    
    if (!redoRenames || redoRenames.length === 0) {
      console.log('Nothing to redo');
      return;
    }
    
    try {
      // To redo a rename, we need to swap old and new paths
      const swappedRenames = redoRenames.map(record => ({
        ...record,
        oldPath: record.newPath,
        oldName: record.newName,
        newPath: record.oldPath,
        newName: record.oldName,
        timestamp: Date.now() // Update timestamp
      }));
      
      // Add these renames back to history (they'll be removed again if the operation fails)
      get().addRename(swappedRenames);
      
      // Call the file store to perform the renames
      await useFileStore.getState().undoRename(swappedRenames);
      console.log('Successfully redid renaming operation');
    } catch (error) {
      console.error('Error during redo operation:', error);
      // If there's an error, remove the failed renames from history
      get().undoLastRename();
    }
  },
  
  // Backward compatibility function - does nothing now
  addToHistory: () => {
    console.log('addToHistory is deprecated and does nothing. Use addRename for file renames.');
    return;
  }
})); 