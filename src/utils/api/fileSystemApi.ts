// Import Tauri APIs using the correct paths for v2
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { IFile } from '../../types/file';

// Debug logging for module initialization
console.log('Initializing fileSystemApi with Tauri v2...');
console.log('Tauri API imports loaded:', {
  invokeType: typeof invoke,
  openType: typeof open
});

// Define interfaces
export interface RenameResult {
  success: boolean;
  message?: string;
  fileId: string;
  originalPath: string;
  newPath: string;
}

/**
 * Open a native file picker dialog and return selected files
 */
export const selectFiles = async (): Promise<IFile[]> => {
  try {
    console.log("Starting selectFiles function...");
    
    try {
      console.log("Invoking Tauri select_files command...");
      const files = await invoke<any[]>('select_files');
      console.log("Files returned from Tauri:", files);
      
      // Transform from Rust format to our frontend format
      return files.map((file: any) => ({
        id: file.id,
        name: file.name,
        path: file.path,
        originalName: file.original_name,
        newName: file.new_name || null,
        isDirectory: file.is_directory,
        size: file.size,
        lastModified: new Date(file.last_modified * 1000),
        type: file.file_type
      }));
    } catch (invokeError) {
      console.error('Error with invoke method:', invokeError);
      
      // Fall back to using the dialog API directly
      console.log("Falling back to dialog API...");
      
      try {
        const selected = await open({
          multiple: true,
          filters: [{ name: 'All Files', extensions: ['*'] }]
        });
        
        console.log("Files selected via dialog API:", selected);
        
        if (Array.isArray(selected) && selected.length > 0) {
          // We only have paths here, need to get file details
          return selected.map((path, index) => {
            const pathParts = path.split(/[/\\]/);
            const name = pathParts[pathParts.length - 1];
            const extension = name.includes('.') ? name.split('.').pop() || '' : '';
            
            return {
              id: `file-${index}-${Date.now()}`,
              name,
              path,
              originalName: name,
              newName: null,
              isDirectory: false,
              size: 0,
              lastModified: new Date(),
              type: extension
            };
          });
        }
        return [];
      } catch (dialogError) {
        console.error('Dialog API error:', dialogError);
        throw new Error(`Failed to select files: ${dialogError}`);
      }
    }
  } catch (error) {
    console.error('Error in selectFiles:', error);
    throw error;
  }
};

/**
 * Open a native folder picker dialog and return selected directory path
 */
export const selectDirectory = async (): Promise<string | null> => {
  try {
    console.log("Starting selectDirectory function...");
    
    try {
      console.log("Invoking Tauri select_directory command...");
      const result = await invoke<string | null>('select_directory');
      console.log("Directory returned from Tauri:", result);
      return result;
    } catch (invokeError) {
      console.error('Error with invoke method:', invokeError);
      
      // Fall back to using the dialog API directly
      console.log("Falling back to dialog API...");
      
      try {
        const selected = await open({
          directory: true,
        });
        
        console.log("Directory selected via dialog API:", selected);
        return selected as string || null;
      } catch (dialogError) {
        console.error('Dialog API error:', dialogError);
        throw new Error(`Failed to select directory: ${dialogError}`);
      }
    }
  } catch (error) {
    console.error('Error in selectDirectory:', error);
    throw error;
  }
};

/**
 * List all files in a directory
 */
export const listDirectoryFiles = async (dirPath: string): Promise<IFile[]> => {
  try {
    console.log("Starting listDirectoryFiles function...");
    console.log("Invoking Tauri list_directory_files command with path:", dirPath);
    
    const files = await invoke<any[]>('list_directory_files', { dirPath });
    console.log("Files returned from directory:", files);
    
    return files.map((file: any) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      originalName: file.original_name,
      newName: file.new_name || null,
      isDirectory: file.is_directory,
      size: file.size,
      lastModified: new Date(file.last_modified * 1000),
      type: file.file_type
    }));
  } catch (error) {
    console.error('Error listing directory files:', error);
    throw error;
  }
};

/**
 * Execute file renaming operations
 */
export const renameFiles = async (files: IFile[]): Promise<RenameResult[]> => {
  try {
    console.log("Starting renameFiles function...", files);
    console.log("Files to rename:", files.length);
    
    // Transform to the format expected by Rust
    const filesForRust = files.map(file => ({
      id: file.id,
      name: file.name,
      path: file.path,
      original_name: file.originalName,
      new_name: file.newName,
      is_directory: file.isDirectory,
      size: file.size,
      last_modified: Math.floor(file.lastModified.getTime() / 1000),
      file_type: file.type
    }));
    
    console.log("Transformed files for Rust:", filesForRust);
    console.log("Invoking Tauri rename_files command...");
    
    try {
      const results = await invoke<any[]>('rename_files', { files: filesForRust });
      console.log("Rename results:", results);
      
      return results.map((result: any) => ({
        success: result.success,
        message: result.message || undefined,
        fileId: result.file_id,
        originalPath: result.original_path,
        newPath: result.new_path
      }));
    } catch (invokeError) {
      console.error('Error with rename_files invoke method:', invokeError);
      throw new Error(`Failed to rename files: ${invokeError}`);
    }
  } catch (error) {
    console.error('Error in renameFiles function:', error);
    throw error;
  }
}; 