import { create } from 'zustand';
import { IFile } from '../types/file';

interface FileState {
  files: IFile[];
  selectedFiles: string[];
  previewMode: boolean;
  processing: boolean;
  addFiles: (newFiles: IFile[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  selectAllFiles: () => void;
  deselectAllFiles: () => void;
  updateFileName: (id: string, newName: string | null) => void;
  setPreviewMode: (mode: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  selectedFiles: [],
  previewMode: false,
  processing: false,
  
  addFiles: (newFiles) => set((state) => {
    // Filter out duplicate files (based on path)
    const existingPaths = new Set(state.files.map(file => file.path));
    const filteredNewFiles = newFiles.filter(file => !existingPaths.has(file.path));
    
    return { 
      files: [...state.files, ...filteredNewFiles],
      // Auto-select the newly added files
      selectedFiles: [...state.selectedFiles, ...filteredNewFiles.map(file => file.id)]
    };
  }),
  
  removeFile: (id) => set((state) => ({
    files: state.files.filter(file => file.id !== id),
    selectedFiles: state.selectedFiles.filter(fileId => fileId !== id)
  })),
  
  clearFiles: () => set({
    files: [],
    selectedFiles: []
  }),
  
  selectFile: (id) => set((state) => ({
    selectedFiles: [...state.selectedFiles, id]
  })),
  
  deselectFile: (id) => set((state) => ({
    selectedFiles: state.selectedFiles.filter(fileId => fileId !== id)
  })),
  
  selectAllFiles: () => set((state) => ({
    selectedFiles: state.files.map(file => file.id)
  })),
  
  deselectAllFiles: () => set({
    selectedFiles: []
  }),
  
  updateFileName: (id, newName) => set((state) => ({
    files: state.files.map(file => 
      file.id === id ? { ...file, newName } : file
    )
  })),
  
  setPreviewMode: (mode) => set({
    previewMode: mode
  }),
  
  setProcessing: (isProcessing) => set({
    processing: isProcessing
  })
})); 