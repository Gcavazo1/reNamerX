import { invoke } from '@tauri-apps/api/core';
import { IFile } from '../../types/file';
import { FileSystemError } from '../api/fileSystemError';

interface MetadataResult {
  success: boolean;
  metadata: Record<string, string>;
  error?: string;
}

/**
 * Extract metadata from a file
 * 
 * @param file The file to extract metadata from
 * @param useID3 Whether to use ID3 metadata extraction (for audio files)
 * @param useExif Whether to use EXIF metadata extraction (for image files)
 * @returns The extracted metadata
 */
export async function extractMetadata(
  file: IFile,
  useID3: boolean,
  useExif: boolean
): Promise<MetadataResult> {
  try {
    // Call the Rust backend to extract metadata with camelCase parameters
    const result = await invoke<MetadataResult>('extract_metadata', {
      filePath: file.path,
      useExif,
      useID3
    });
    
    return result;
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new FileSystemError(
      `Failed to extract metadata from ${file.name}: ${error instanceof Error ? error.message : String(error)}`,
      'METADATA_EXTRACTION_ERROR',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Format a string with metadata placeholders
 * 
 * @param pattern The pattern string with placeholders like {artist}, {title}, etc.
 * @param metadata The metadata object with key-value pairs
 * @returns The formatted string with placeholders replaced by metadata values
 */
export function formatWithPattern(
  pattern: string,
  metadata: Record<string, string>
): string {
  if (!pattern) return '';
  
  // Replace all placeholders in the pattern with metadata values
  return pattern.replace(/{([^}]+)}/g, (match, key) => {
    return metadata[key] || '';
  });
}

/**
 * Get available metadata fields based on file type
 * 
 * @param fileType The file type/extension
 * @returns Array of available metadata fields
 */
export function getAvailableMetadataFields(fileType: string): string[] {
  const lowerType = fileType.toLowerCase();
  
  // Audio files
  if (['mp3', 'flac', 'wav', 'm4a', 'aac', 'ogg'].includes(lowerType)) {
    return ['artist', 'title', 'album', 'year', 'genre', 'track', 'composer'];
  }
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'tiff', 'tif', 'webp'].includes(lowerType)) {
    return ['camera', 'resolution', 'date', 'location', 'iso', 'exposure'];
  }
  
  // Video files
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(lowerType)) {
    return ['duration', 'resolution', 'date', 'frameRate', 'codec'];
  }
  
  // Default
  return [];
} 