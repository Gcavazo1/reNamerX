// Import Tauri APIs using the correct paths for v2
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { IFile } from '../../types/file';
import { FileInfo } from '../../types/files';
import { CHUNK_SIZE } from '../../config/constants';
import { useFileStore } from '../../stores/fileStore';
import { pathUtils } from '../fileUtils';
import { FileSystemError, FileSystemErrorType } from './fileSystemError';

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
export async function selectFiles(): Promise<IFile[]> {
  try {
    // Open file dialog
    const selected = await open({
      multiple: true,
      filters: [{
        name: 'All Files',
        extensions: ['*']
      }]
    });

    if (!selected) {
      return [];
    }

    // Convert to array if single file selected
    const selectedPaths = Array.isArray(selected) ? selected : [selected];

    // Get file info for each selected path
    const files = await Promise.all(
      selectedPaths.map(async (path) => {
        try {
          const fileInfo = await invoke<IFile>('get_file_info', { 
            filePath: path 
          });
          return fileInfo;
        } catch (error) {
          throw new FileSystemError(
            `Failed to get file info for ${path}: ${error instanceof Error ? error.message : String(error)}`,
            'FILE_INFO_ERROR',
            error instanceof Error ? error : undefined
          );
        }
      })
    );

    return files;
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new FileSystemError(
      `Failed to select files: ${error instanceof Error ? error.message : String(error)}`,
      'FILE_SELECTION_ERROR',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Open a native folder picker dialog and return selected directory path
 */
export async function selectDirectory(): Promise<string | null> {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      defaultPath: '~'
    });

    return selected as string;
  } catch (error) {
    throw FileSystemError.fromNativeError(error);
  }
}

/**
 * List all files in a directory (can be filtered to only include files, not sub-directories)
 */
export async function listDirectoryFiles(
  directoryPath: string,
  filesOnly: boolean = true
): Promise<FileInfo[]> {
  if (!directoryPath) {
    throw new FileSystemError('No directory path provided', FileSystemErrorType.INVALID_PATH);
  }

  try {
    const files = await invoke('list_directory_files', {
      dirPath: directoryPath,
      filesOnly: filesOnly
    });

    return files as FileInfo[];
  } catch (error) {
    throw FileSystemError.fromNativeError(error, directoryPath);
  }
}

/**
 * Execute file renaming operations with chunking for better performance
 */
export async function renameFiles(
  renames: { id: string; oldName: string | null; newName: string }[]
): Promise<{ success: string[]; failed: string[] }> {
  const results = {
    success: [] as string[],
    failed: [] as string[]
  };

  console.log(`Preparing to rename ${renames.length} files`);

  try {
    // First, get the current files to ensure we have the latest paths
    // We need to convert the rename requests with IDs to actual file paths
    const filePathPairs: { old_path: string; new_path: string }[] = [];
    const idByPath: Map<string, string> = new Map();
    
    // Build the file path pairs with proper old and new paths
    for (const rename of renames) {
      console.log(`Processing rename for file ID ${rename.id}: ${rename.oldName} -> ${rename.newName}`);
      
      const currentFile = findFileById(rename.id);
      if (!currentFile) {
        console.warn(`Could not find file with ID ${rename.id} for rename operation`);
        results.failed.push(rename.id);
        continue;
      }

      // Make sure we have the current path
      const currentPath = currentFile.path;
      const dirPath = pathUtils.dirname(currentPath);
      const newPath = pathUtils.join(dirPath, rename.newName);
      
      // Skip if old and new paths are the same
      if (currentPath === newPath) {
        console.log(`Skipping rename for ${currentPath} - paths are identical`);
        continue;
      }
      
      filePathPairs.push({
        old_path: currentPath,
        new_path: newPath
      });
      
      // Store the ID by path for quick lookup
      idByPath.set(currentPath, rename.id);
      
      console.log(`Will rename: ${currentPath} -> ${newPath}`);
    }
    
    if (filePathPairs.length === 0) {
      console.warn('No valid files to rename after path processing');
      return results;
    }
    
    // Now process in chunks
    for (let i = 0; i < filePathPairs.length; i += CHUNK_SIZE) {
      const chunk = filePathPairs.slice(i, i + CHUNK_SIZE);
      
      try {
        console.log(`Processing chunk ${i/CHUNK_SIZE + 1} with ${chunk.length} files`);
        
        // Map snake_case object keys to camelCase for Rust
        const camelCaseChunk = chunk.map(file => ({
          oldPath: file.old_path,
          newPath: file.new_path
        }));
        
        // Use camelCase parameters and expect an array of successful paths
        const successPaths = await invoke('rename_files', { 
          files: camelCaseChunk 
        }) as string[];
        
        console.log(`Successfully renamed paths:`, successPaths);
        
        // Map back from paths to IDs
        for (const successPath of successPaths) {
          const id = idByPath.get(successPath);
          if (id) {
            results.success.push(id);
          }
        }
        
        // Any paths not in the success list are considered failed
        for (const file of chunk) {
          const id = idByPath.get(file.old_path);
          if (id && !successPaths.includes(file.old_path) && !results.success.includes(id)) {
            results.failed.push(id);
          }
        }
        
        console.log(`Successfully renamed ${successPaths.length} files in chunk`);
      } catch (err) {
        console.error('Error renaming files in chunk:', err);
        
        // If the entire chunk failed, add all IDs to the failed list
        for (const file of chunk) {
          const id = idByPath.get(file.old_path);
          if (id && !results.success.includes(id) && !results.failed.includes(id)) {
            results.failed.push(id);
          }
        }
      }
    }
    
    console.log(`Rename operation completed - Success: ${results.success.length}, Failed: ${results.failed.length}`);

    // Check if we have any successful renames
    if (results.success.length === 0 && results.failed.length === 0) {
      console.warn('No files were processed during the rename operation');
    }

    // Ensure success and failed lists don't have duplicates
    results.success = [...new Set(results.success)];
    results.failed = [...new Set(results.failed)];

    // Make sure no ID appears in both success and failed lists
    results.failed = results.failed.filter(id => !results.success.includes(id));

    console.log('Final results:', {
      success: results.success,
      failed: results.failed
    });

    return results;
  } catch (err) {
    console.error('Error in renameFiles function:', err);
    throw FileSystemError.fromNativeError(err);
  }
}

// Helper function to find a file by ID using the global store
function findFileById(id: string) {
  const { files } = useFileStore.getState();
  return files.find(f => f.id === id);
}

// Helper function to find ID by path
function findIdByPath(filePath: string, renames: { id: string; oldName: string | null; newName: string }[]): string | undefined {
  // First, find the file in the store
  const { files } = useFileStore.getState();
  const file = files.find(f => f.path === filePath);
  
  if (file) {
    return file.id;
  }
  
  // If not found in store, try to match against the renames array
  for (const rename of renames) {
    const currentFile = findFileById(rename.id);
    if (currentFile && currentFile.path === filePath) {
      return rename.id;
    }
  }
  
  return undefined;
}

/**
 * Get detailed file information
 * @param filePath Path to the file to get information about
 */
export async function getFileInfo(filePath: string): Promise<FileInfo> {
  try {
    const fileInfo = await invoke('get_file_info', {
      filePath: filePath
    });
    return fileInfo as FileInfo;
  } catch (error) {
    throw FileSystemError.fromNativeError(error, filePath);
  }
}

/**
 * Execute file renaming operations by direct paths
 * This is mainly used for undo operations when files might not be in the current state
 */
export async function renameFilesByPath(
  renamePairs: { oldPath: string; newPath: string }[]
): Promise<{ success: boolean; error?: string }> {
  console.log(`Preparing to rename ${renamePairs.length} files by path`);

  try {
    if (renamePairs.length === 0) {
      console.warn('No valid files to rename');
      return { success: false, error: 'No valid files to rename' };
    }
    
    // Debug actual file paths to check if they exist
    for (const pair of renamePairs) {
      try {
        // Add detailed logging to help diagnose issues
        console.log('Checking paths for undo operation:', {
          oldPath: pair.oldPath,
          oldPathExists: await invoke('select_directory_path', { dirPath: pathUtils.dirname(pair.oldPath) })
            .then(() => true)
            .catch(() => false),
          newPath: pair.newPath,
          newPathParentExists: await invoke('select_directory_path', { dirPath: pathUtils.dirname(pair.newPath) })
            .then(() => true)
            .catch(() => false)
        });
      } catch (error) {
        console.error('Error checking path existence:', error);
      }
    }
    
    const results = {
      success: true,
      error: undefined as string | undefined,
      successCount: 0,
      failedCount: 0
    };
    
    // Process in batches of 50 for better performance with large operations
    const BATCH_SIZE = 50;
    
    // Process all rename pairs in chunks
    for (let i = 0; i < renamePairs.length; i += BATCH_SIZE) {
      const chunk = renamePairs.slice(i, i + BATCH_SIZE);
      console.log(`Processing undo chunk ${Math.floor(i/BATCH_SIZE) + 1} with ${chunk.length} files`);
      
      try {
        // Map to camelCase for Rust backend
        const camelCaseFiles = chunk.map(file => ({
          oldPath: file.oldPath,
          newPath: file.newPath
        }));
        
        // Call the Rust backend
        console.log('Sending to Rust backend:', camelCaseFiles);
        const successPaths = await invoke('rename_files', { 
          files: camelCaseFiles 
        }) as string[];
        
        results.successCount += successPaths.length;
        
        // Log which paths succeeded and which failed
        const successSet = new Set(successPaths);
        for (const file of chunk) {
          if (successSet.has(file.oldPath)) {
            console.log(`Successfully renamed: ${file.oldPath} -> ${file.newPath}`);
          } else {
            console.error(`Failed to rename: ${file.oldPath} -> ${file.newPath}`);
            results.failedCount++;
            results.success = false;
          }
        }
        
        console.log(`Successfully renamed ${successPaths.length}/${chunk.length} files in chunk`);
      } catch (err) {
        console.error('Error in chunk rename:', err);
        results.success = false;
        results.error = err instanceof Error ? err.message : String(err);
        results.failedCount += chunk.length;
      }
    }
    
    // Provide detailed results
    if (results.failedCount > 0) {
      results.error = `Failed to rename ${results.failedCount} of ${renamePairs.length} files`;
      console.warn(results.error);
    }
    
    console.log(`Rename by path operation completed - Success: ${results.successCount}, Failed: ${results.failedCount}`);
    
    return { 
      success: results.successCount > 0, 
      error: results.error 
    };
  } catch (err) {
    console.error('Error in renameFilesByPath function:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : String(err)
    };
  }
} 