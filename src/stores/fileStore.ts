import { create } from 'zustand';
import { IFile } from '../types/file';
import { useHistoryStore, RenameRecord } from './historyStore';
import { renameFiles, renameFilesByPath } from '../utils/api/fileSystemApi';
import { runInAction } from 'mobx';
import { useFileFilterStore } from './fileFilterStore';
import { pathUtils } from '../utils/fileUtils';
import { FileInfo } from '../types/files';

export interface FileState {
  files: IFile[];
  filteredFiles: IFile[];
  selectedFiles: string[];
  fileFilter: string;
  fileTypeFilter: string | null;
  processing: boolean;
  directory: string | null;
  previewMode: 'side-by-side' | 'list';
  
  // File operations
  addFiles: (newFiles: IFile[], selectAdded?: boolean) => void;
  removeFile: (fileId: string) => void;
  removeFiles: (fileIds: string[]) => void;
  clearFiles: () => void;
  
  // Selection operations
  selectFile: (fileId: string) => void;
  deselectFile: (fileId: string) => void;
  toggleSelectedFile: (fileId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  invertSelection: () => void;
  
  // File name operations
  updateFileName: (fileId: string, newName: string) => void;
  updateNewName: (fileId: string, newName: string) => void;
  updateNewNames: (fileUpdates: { id: string; newName: string }[]) => void;
  updateFileNames: (fileIds: string[], newNames: string[]) => void;
  
  // Directory operations
  loadDirectory: (directoryPath: string) => Promise<void>;
  
  // Filtering
  setFileFilter: (filter: string) => void;
  applyFileFilter: () => void;
  setFileTypeFilter: (fileType: string | null) => void;
  
  // UI state
  setPreviewMode: (mode: 'side-by-side' | 'list') => void;
  setProcessing: (isProcessing: boolean) => void;
  
  // State setters
  setFiles: (files: IFile[]) => void;
  setFilteredFiles: (files: IFile[]) => void;
  setSelectedFiles: (selectedFiles: string[]) => void;
  
  // Renaming operations
  renameFiles: (renamePairs: { id: string; oldName: string | null; newName: string }[]) => void;
  
  // Undo operations
  undoRename: (renames: RenameRecord[]) => Promise<[string[], string[]]>;
  undoAddFiles: (data: { files: IFile[] }) => void;
  redoAddFiles: (data: { files: IFile[] }) => void;
  undoRemoveFiles: (data: { files: IFile[] }) => void;
  redoRemoveFiles: (data: { files: IFile[] }) => void;
  undoUpdateFileName: (fileId: string, oldName: string) => void;
  redoUpdateFileName: (fileId: string, newName: string) => void;
  
  // Keyboard shortcut utility
  exposeKeyboardShortcutFunctions: () => void;
}

// Add missing utility functions
const generateId = (): string => {
  // Simple UUID generator without dependency
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getFileExtension = (filePath: string): string => {
  const lastDotIndex = filePath.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : filePath.substring(lastDotIndex + 1);
};

// Mock function for listDirectoryFiles if not implemented yet
const listDirectoryFiles = async (directoryPath: string): Promise<FileInfo[]> => {
  // This would actually call your Tauri API or other file system API
  console.log(`Loading directory: ${directoryPath}`);
  return []; // Return empty array for now
};

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  filteredFiles: [],
  selectedFiles: [],
  fileFilter: '',
  fileTypeFilter: null,
  previewMode: 'side-by-side',
  processing: false,
  directory: null,
  
  loadDirectory: async (directoryPath: string) => {
    set({ processing: true, directory: directoryPath });
    
    try {
      // Fetch files from the directory
      const files = await listDirectoryFiles(directoryPath);
      
      // Process these files similar to addFiles but replace the current set
      const newFiles: IFile[] = files.map(fileInfo => ({
        id: generateId(),
        name: fileInfo.name,
        newName: fileInfo.name,
        originalName: fileInfo.name,
        path: fileInfo.path,
        isDirectory: fileInfo.isDirectory,
        size: fileInfo.size || 0,
        lastModified: new Date(fileInfo.dateModified || Date.now()),
        type: getFileExtension(fileInfo.path)
      }));
      
      set({
        files: newFiles,
        filteredFiles: newFiles,
        selectedFiles: []
      });
    } catch (error) {
      console.error('Error loading directory:', error);
    } finally {
      set({ processing: false });
    }
  },
  
  toggleSelectedFile: (fileId: string) => {
    set(state => {
      if (state.selectedFiles.includes(fileId)) {
        return {
          selectedFiles: state.selectedFiles.filter(id => id !== fileId)
        };
      } else {
        return {
          selectedFiles: [...state.selectedFiles, fileId]
        };
      }
    });
  },
  
  updateNewName: (fileId: string, newName: string) => {
    set(state => ({
      files: state.files.map(file => 
        file.id === fileId ? { ...file, newName } : file
      )
    }));
  },
  
  updateNewNames: (fileUpdates: { id: string; newName: string }[]) => {
    if (fileUpdates.length === 0) return;
    
    set(state => ({
      files: state.files.map(file => {
        const update = fileUpdates.find(u => u.id === file.id);
        return update ? { ...file, newName: update.newName } : file;
      })
    }));
  },
  
  removeAllFiles: () => {
    set({
      files: [],
      selectedFiles: []
    });
  },
  
  // Rest of the implementation...
  
  addFiles: (newFiles: IFile[], selectAdded = false) => {
    const existingPaths = new Set(get().files.map(file => file.path));
    const filteredNewFiles = newFiles.filter(file => !existingPaths.has(file.path));
    
    if (filteredNewFiles.length === 0) return;
    
    // We no longer track adding files in history
    
    const newSelectedFiles = selectAdded
      ? [...get().selectedFiles, ...filteredNewFiles.map(f => f.id)]
      : get().selectedFiles;
    
    set((state) => ({
      files: [...state.files, ...filteredNewFiles],
      filteredFiles: [...state.filteredFiles, ...filteredNewFiles],
      selectedFiles: newSelectedFiles
    }));
  },
  
  removeFile: (id: string) => {
    const fileToRemove = get().files.find(f => f.id === id);
    if (!fileToRemove) return;
    
    // We no longer track removal operations in history
    
    set((state) => ({
      files: state.files.filter(file => file.id !== id),
      selectedFiles: state.selectedFiles.filter(fileId => fileId !== id)
    }));
  },
  
  removeFiles: (ids: string[]) => {
    const filesToRemove = get().files.filter(f => ids.includes(f.id));
    if (filesToRemove.length === 0) return;
    
    // We no longer track removal operations in history
    
    set((state) => ({
      files: state.files.filter(file => !ids.includes(file.id)),
      selectedFiles: state.selectedFiles.filter(fileId => !ids.includes(fileId))
    }));
  },
  
  clearFiles: () => {
    const currentFiles = get().files;
    const selectedFileIds = get().selectedFiles;
    
    // If no files are selected, do nothing
    if (selectedFileIds.length === 0) return;
    
    // Get only the files that are currently selected
    const selectedFiles = currentFiles.filter(file => selectedFileIds.includes(file.id));
    
    // We no longer track file removal in history
    
    // Reset file filter to 'All Files'
    useFileFilterStore.getState().resetFilter();
    
    // Remove only the selected files from the files array
    set((state) => ({
      files: state.files.filter(file => !selectedFileIds.includes(file.id)),
      selectedFiles: [] // Clear selection after removing files
    }));
  },
  
  selectFile: (id: string) => set((state) => ({
    selectedFiles: [...state.selectedFiles, id]
  })),
  
  deselectFile: (id: string) => set((state) => ({
    selectedFiles: state.selectedFiles.filter(fileId => fileId !== id)
  })),
  
  deselectFiles: (ids: string[]) => set((state) => ({
    selectedFiles: state.selectedFiles.filter(fileId => !ids.includes(fileId))
  })),
  
  selectAllFiles: () => set((state) => ({
    selectedFiles: state.files.map(file => file.id)
  })),
  
  deselectAllFiles: () => set({
    selectedFiles: []
  }),
  
  invertSelection: () => set((state) => {
    const allFileIds = state.files.map(file => file.id);
    const newSelectedFiles = allFileIds.filter(id => !state.selectedFiles.includes(id));
    return { selectedFiles: newSelectedFiles };
  }),
  
  updateFileName: (id: string, newName: string) => {
    const file = get().files.find(f => f.id === id);
    if (!file) return;
    
    // We no longer track filename updates in history
    
    set((state) => ({
      files: state.files.map(file => 
        file.id === id ? { ...file, newName } : file
      )
    }));
  },
  
  // ... rest of implementation with proper type annotations ...
  
  exposeKeyboardShortcutFunctions: () => {
    const { 
      selectFile, 
      deselectFile, 
      toggleSelectedFile, 
      selectAll, 
      deselectAll, 
      invertSelection 
    } = get();
    
    // If using window for debugging
    if (typeof window !== 'undefined') {
      (window as any).__selectFile = selectFile;
      (window as any).__invertSelection = invertSelection;
    }
  },
  
  // Function for bulk renaming files (used with rename operations)
  renameFiles: (renamePairs: { id: string; oldName: string | null; newName: string }[]) => {
    if (renamePairs.length === 0) return;
    
    // We no longer track renames in history here,
    // as that's handled in PreviewPanel when the actual file rename occurs
    
    set((state) => ({
      files: state.files.map(file => {
        const rename = renamePairs.find(r => r.id === file.id);
        return rename ? { ...file, name: rename.newName, originalName: file.name } : file;
      })
    }));
  },
  
  setPreviewMode: (mode: 'side-by-side' | 'list') => set({
    previewMode: mode
  }),
  
  setProcessing: (isProcessing: boolean) => set({
    processing: isProcessing
  }),
  
  setFiles: (files: IFile[]) => {
    if (!Array.isArray(files) && typeof files !== 'function') {
      console.error('setFiles received non-array value:', files);
      return;
    }
    if (typeof files === 'function') {
      console.error('Received a function instead of an array in setFiles. This likely indicates a React state update function was passed directly.');
      return;
    }
    set({
      files: files
    });
  },
  
  setFilteredFiles: (files: IFile[]) => {
    if (!Array.isArray(files)) {
      console.error('setFilteredFiles received non-array value:', files);
      return;
    }
    set({
      filteredFiles: files
    });
  },
  
  setSelectedFiles: (selectedFiles: string[]) => set({
    selectedFiles: selectedFiles
  }),
  
  // Undo/redo handlers
  undoRename: async (renames: RenameRecord[]): Promise<[string[], string[]]> => {
    if (!renames || renames.length === 0) {
      console.warn('No renames to undo');
      return [[], []];
    }

    const successIds: string[] = [];
    const failedIds: string[] = [];
    
    console.log('Starting undo operation with rename records:', renames);
    
    // Performance optimization: Create a map for faster lookups
    const renameMap = new Map<string, RenameRecord>();
    for (const rename of renames) {
      renameMap.set(rename.id, rename);
    }
    
    // Create path-based rename pairs for the backend
    const renamePairs = renames
      .filter(rename => {
        if (!rename.oldPath || !rename.newPath) {
          console.warn(`Skipping rename record for ID ${rename.id}: missing path information`, rename);
          return false;
        }
        return true;
      })
      .map(rename => {
        console.log(`Creating undo pair for file ID ${rename.id}:`, {
          current: rename.newPath,
          original: rename.oldPath
        });
        
        return {
          oldPath: rename.newPath,    // Current path after the rename
          newPath: rename.oldPath     // Original path to restore
        };
      });

    if (renamePairs.length === 0) {
      console.warn('No valid rename pairs to undo');
      return [[], []];
    }

    console.log(`Generated ${renamePairs.length} undo rename pairs:`, renamePairs);

    try {
      // Call the new path-based API
      const result = await renameFilesByPath(renamePairs);
      console.log('Undo rename result:', result);

      if (result.success) {
        // Mark all as successful
        successIds.push(...renames.map(r => r.id));
        console.log(`Successfully undid ${successIds.length} renames - updating UI state`);
        
        // Update any files that might still be in the state (for UI consistency)
        const currentFiles = get().files;
        if (currentFiles.length > 0) {
          // Performance optimization: Only update files if needed
          const fileIdsToUpdate = new Set(renames.map(r => r.id));
          
          // Only update files that need it
          if (fileIdsToUpdate.size > 0) {
            console.log(`Updating ${fileIdsToUpdate.size} files in UI state`);
            
            const updatedFiles = currentFiles.map(file => {
              // Skip files not in the update set
              if (!fileIdsToUpdate.has(file.id)) return file;
              
              // Find if this file was part of the undo operation
              const renamedFile = renameMap.get(file.id);
              if (renamedFile) {
                // Restore the original path and name
                const updatedFile = {
                  ...file,
                  path: renamedFile.oldPath,
                  name: pathUtils.basename(renamedFile.oldPath)
                };
                console.log(`Updated file in state:`, {
                  id: file.id,
                  from: file.path,
                  to: updatedFile.path
                });
                return updatedFile;
              }
              return file;
            });
            
            // Update the state with modified files
            set({ files: updatedFiles });
            console.log('UI state updated with restored file names');
          }
        } else {
          console.log('No files in state to update after undo');
        }
        
        console.log(`Successfully undid ${successIds.length} renames`);
      } else {
        // Mark all as failed
        failedIds.push(...renames.map(r => r.id));
        console.error('Failed to undo renames:', result.error);
      }
    } catch (error) {
      // Mark all as failed
      failedIds.push(...renames.map(r => r.id));
      console.error('Error during undo rename operation:', error);
    }

    return [successIds, failedIds];
  },
  
  undoAddFiles: (data: { files: IFile[] }) => {
    const { files } = data;
    if (!files || !Array.isArray(files)) return;
    
    const fileIds = files.map(f => f.id);
    
    set((state) => ({
      files: state.files.filter(file => !fileIds.includes(file.id)),
      selectedFiles: state.selectedFiles.filter(id => !fileIds.includes(id))
    }));
  },
  
  redoAddFiles: (data: { files: IFile[] }) => {
    const { files } = data;
    if (!files || !Array.isArray(files)) return;
    
    set((state) => ({
      files: [...state.files, ...files],
      selectedFiles: [...state.selectedFiles, ...files.map(file => file.id)]
    }));
  },
  
  undoRemoveFiles: (data: { files: IFile[] }) => {
    const { files } = data;
    if (!files || !Array.isArray(files)) return;
    
    set((state) => ({
      files: [...state.files, ...files],
      selectedFiles: [...state.selectedFiles]
    }));
  },
  
  redoRemoveFiles: (data: { files: IFile[] }) => {
    const { files } = data;
    if (!files || !Array.isArray(files)) return;
    
    const fileIds = files.map(f => f.id);
    
    set((state) => ({
      files: state.files.filter(file => !fileIds.includes(file.id)),
      selectedFiles: state.selectedFiles.filter(id => !fileIds.includes(id))
    }));
  },
  
  undoUpdateFileName: (fileId: string, oldName: string) => {
    set((state) => ({
      files: state.files.map(file => 
        file.id === fileId ? { ...file, newName: oldName } : file
      )
    }));
  },
  
  redoUpdateFileName: (fileId: string, newName: string) => {
    set((state) => ({
      files: state.files.map(file => 
        file.id === fileId ? { ...file, newName } : file
      )
    }));
  },

  // Add the missing methods
  selectAll: () => {
    set(state => ({
      selectedFiles: state.files.map(f => f.id)
    }));
  },
  
  deselectAll: () => {
    set({ selectedFiles: [] });
  },
  
  updateFileNames: (fileIds: string[], newNames: string[]) => {
    if (fileIds.length !== newNames.length) {
      console.error('fileIds and newNames arrays must have the same length');
      return;
    }
    
    set(state => ({
      files: state.files.map(file => {
        const index = fileIds.indexOf(file.id);
        if (index !== -1) {
          return { ...file, newName: newNames[index] };
        }
        return file;
      })
    }));
  },
  
  setFileFilter: (filter: string) => {
    set({ fileFilter: filter });
    get().applyFileFilter();
  },
  
  applyFileFilter: () => {
    const { files, fileFilter, fileTypeFilter } = get();
    
    const filteredFiles = files.filter(file => {
      // Filter by name if a filter is set
      const nameMatch = !fileFilter || 
        file.name.toLowerCase().includes(fileFilter.toLowerCase());
      
      // Filter by file type if a type filter is set
      const typeMatch = !fileTypeFilter || 
        getFileExtension(file.path) === fileTypeFilter;
      
      return nameMatch && typeMatch;
    });
    
    set({ filteredFiles });
  },
  
  setFileTypeFilter: (fileType: string | null) => {
    set({ fileTypeFilter: fileType });
    get().applyFileFilter();
  },
})); 