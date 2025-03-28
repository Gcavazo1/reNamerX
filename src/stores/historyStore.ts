import { create } from 'zustand';

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
  
  // Operations
  addRename: (renames: RenameRecord[]) => void;
  undoLastRename: () => RenameRecord[] | null;
  canUndo: () => boolean;
  clearHistory: () => void;
  trackFailedUndos: (failedIds: string[]) => void;
  getBatchSize: () => number;
  
  // Backward compatibility function - does nothing now
  addToHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  renameHistory: [],
  
  // Add rename operations to history
  addRename: (renames) => set(state => {
    if (!renames || renames.length === 0) return state;
    
    console.log(`Adding ${renames.length} renames to history`);
    
    // Add to the beginning of the array (newest operations first)
    // Store the complete batch, but limit total history size to prevent memory issues
    return {
      renameHistory: [...renames, ...state.renameHistory].slice(0, MAX_HISTORY_LENGTH)
    };
  }),
  
  // Undo the last rename operation
  undoLastRename: () => {
    const { renameHistory } = get();
    
    if (renameHistory.length === 0) {
      console.log('No rename operations to undo');
      return null;
    }
    
    // Get renames from the most recent batch (they were added together)
    const firstTimestamp = renameHistory[0].timestamp;
    const renamesToUndo = renameHistory.filter(r => r.timestamp === firstTimestamp);
    
    // Remove these renames from history
    set({
      renameHistory: renameHistory.slice(renamesToUndo.length)
    });
    
    console.log(`Returning ${renamesToUndo.length} renames to undo`);
    return renamesToUndo;
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
  
  // Clear all history
  clearHistory: () => set({
    renameHistory: []
  }),
  
  // Backward compatibility function - does nothing now
  addToHistory: () => {
    console.log('addToHistory is deprecated and does nothing. Use addRename for file renames.');
    return;
  }
})); 