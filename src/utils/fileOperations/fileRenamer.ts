import { IRules } from "../../stores/rulesStore";
import { IFile } from "../../types/file";
import { transformCase } from "../formatters/caseFormatters";
import { formatNumber, getNextNumber, insertNumberAtPosition } from "../formatters/numberFormatters";
import { sanitizeFileName, isValidFileName } from "../validators/fileNameValidator";
import { getFileNameWithoutExtension, getFileExtension } from "../formatters/caseFormatters";
import { FileSystemError, FileSystemErrorType } from "../api/fileSystemError";
import { invoke } from '@tauri-apps/api/core';

/**
 * Interface for renaming operation results
 */
export interface IRenameResult {
  success: boolean;
  error?: string;
  originalPath: string;
  newPath: string;
}

/**
 * Simple result for rename operations
 */
export interface RenameResult {
  success: boolean;
  error?: string;
}

/**
 * Interface for the preview results
 */
export interface IPreviewResult {
  fileId: string;
  originalName: string;
  newName: string;
  isValid: boolean;
  error?: string;
}

/**
 * Detects and extracts number patterns in filenames
 * Returns the base name and the number
 */
export const extractNumberFromFileName = (fileName: string): { baseName: string, number: number | null, numberStr: string } => {
  // Match number pattern (any sequence of digits)
  const numberMatch = fileName.match(/(\d+)/);
  
  if (numberMatch) {
    const numberStr = numberMatch[0];
    const number = parseInt(numberStr, 10);
    // Get position of the number in the string
    const numberIndex = fileName.indexOf(numberStr);
    // Extract base name by removing the number
    const baseName = fileName.slice(0, numberIndex) + fileName.slice(numberIndex + numberStr.length);
    
    return { baseName, number, numberStr };
  }
  
  return { baseName: fileName, number: null, numberStr: '' };
};

/**
 * Applies renaming rules to a single file name
 */
export const applyRules = (filename: string, rules: IRules, index: number = 0): string => {
  let result = filename;
  let extension = '';
  
  // Extract the extension first
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    extension = filename.substring(lastDotIndex);
    result = filename.substring(0, lastDotIndex);
  }
  
  // Apply text operations
  const { textOperations } = rules;
  
  // Find & Replace
  if (textOperations.findReplace.enabled) {
    const { find, replace, useRegex, caseSensitive, replaceEntire } = textOperations.findReplace;
    
    // Handle "Replace Entire Filename" option
    if (replaceEntire) {
      result = replace; // Simply replace the entire filename with the replace value
    } else if (find) {
      // Regular find & replace operation
      if (useRegex) {
        try {
          const flags = caseSensitive ? 'g' : 'gi';
          const regex = new RegExp(find, flags);
          result = result.replace(regex, replace);
        } catch (error) {
          console.error('Invalid regex pattern:', error);
        }
      } else {
        if (caseSensitive) {
          result = result.split(find).join(replace);
        } else {
          // Case insensitive replacement without regex
          const escapedFind = find.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          const regex = new RegExp(escapedFind, 'gi');
          result = result.replace(regex, replace);
        }
      }
    }
  }
  
  // Apply remove characters
  if (textOperations.removeChars.enabled) {
    const { fromStart, fromEnd } = textOperations.removeChars;
    
    if (fromStart > 0) {
      result = result.substring(Math.min(fromStart, result.length));
    }
    
    if (fromEnd > 0) {
      result = result.substring(0, Math.max(0, result.length - fromEnd));
    }
  }
  
  // Prepare prefix and suffix with spaces when case transformation is enabled
  // This helps with word boundary detection for proper case transformation
  let prefix = "";
  let suffix = "";
  
  if (textOperations.prefix.enabled && textOperations.prefix.text) {
    const prefixText = textOperations.prefix.text;
    // Add a space after prefix if case transformation is enabled and prefix doesn't already end with space
    prefix = rules.caseTransformation.enabled && !prefixText.endsWith(' ') ? 
      prefixText + ' ' : prefixText;
  }
    
  if (textOperations.suffix.enabled && textOperations.suffix.text) {
    const suffixText = textOperations.suffix.text;
    // Add a space before suffix if case transformation is enabled and suffix doesn't already start with space
    suffix = rules.caseTransformation.enabled && !suffixText.startsWith(' ') ? 
      ' ' + suffixText : suffixText;
  }
  
  // Apply case transformation to the ENTIRE string (prefix + name + suffix)
  let caseType = rules.caseTransformation.enabled ? rules.caseTransformation.type : undefined;
  
  if (rules.caseTransformation.enabled) {
    // Combine all parts first, then apply case transformation
    const combinedName = prefix + result + suffix;
    console.log(`Applying case transformation: ${rules.caseTransformation.type} to "${combinedName}"`);
    result = transformCase(combinedName, rules.caseTransformation.type);
    // No need to add prefix/suffix since they were included in the transformation
  } else {
    // If no case transformation, just add prefix and suffix normally
    result = prefix + result + suffix;
  }
  
  // Apply numbering
  if (rules.numbering.enabled) {
    // Extract existing number if present and remove it if numbering is enabled
    const { baseName, number } = extractNumberFromFileName(result);
    
    // If we found a number, use the base name without the number
    if (number !== null) {
      result = baseName;
    }
    
    // Use the index directly as passed, ensuring we start at exactly the user's chosen number
    const num = rules.numbering.start + (index * rules.numbering.increment);
    const formattedNum = formatNumber(
      num, 
      rules.numbering.format, 
      rules.numbering.customPadding
    );
    
    // Pass the caseTransformation type to properly format separators
    result = insertNumberAtPosition(
      result, 
      formattedNum, 
      rules.numbering.position, 
      rules.numbering.customPosition,
      rules.caseTransformation.enabled ? rules.caseTransformation.type : undefined
    );
  }
  
  // Apply date stamp
  if (rules.advanced.dateStamp.enabled) {
    const now = new Date();
    let dateStr: string;
    
    try {
      // Simple date formatting (can be enhanced with a date library like date-fns)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      // Replace format tokens with actual values
      dateStr = rules.advanced.dateStamp.format
        .replace(/YYYY/g, year.toString())
        .replace(/MM/g, month)
        .replace(/DD/g, day)
        .replace(/HH/g, hours)
        .replace(/mm/g, minutes)
        .replace(/ss/g, seconds);
    } catch (error) {
      dateStr = now.toISOString().split('T')[0]; // Default to YYYY-MM-DD
    }
    
    result = insertNumberAtPosition(
      result,
      dateStr,
      rules.advanced.dateStamp.position,
      rules.advanced.dateStamp.customPosition,
      caseType
    );
  }
  
  // Reattach the extension at the end
  result += extension;
  
  // Sanitize the file name
  return sanitizeFileName(result);
};

/**
 * Generate preview of the renamed files based on the current rules
 * Performance optimized version
 */
export function generatePreview(files: IFile[], rules: IRules): IPreviewResult[] {
  try {
    const startTime = performance.now();
    
    // Early return for empty files
    if (files.length === 0) {
      return [];
    }
    
    // Process files in a single pass for better performance
    const results = files.map((file, index) => {
      try {
        // Use the global index across the entire set of files
        // This ensures numbering is continuous even when processing in batches
        const newName = applyRules(file.name, rules, index);
        const isValid = isValidFileName(newName);
        
        return {
          fileId: file.id,
          originalName: file.name,
          newName,
          isValid,
          error: isValid ? undefined : 'Invalid file name'
        };
      } catch (error) {
        return {
          fileId: file.id,
          originalName: file.name,
          newName: file.name,
          isValid: false,
          error: 'Error generating preview'
        };
      }
    });
    
    const endTime = performance.now();
    
    return results;
  } catch (error) {
    throw error;
  }
}

/**
 * Apply text replacement with optional regex support
 */
function applyTextReplacement(
  text: string,
  find: string,
  replace: string,
  useRegex: boolean
): string {
  if (!find) return text;

  try {
    if (useRegex) {
      const regex = new RegExp(find, 'g');
      return text.replace(regex, replace);
    }
    // Escape special regex characters if not using regex mode
    return text.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
  } catch (error) {
    console.error('Error in text replacement:', error);
    // Return original text on error
    return text;
  }
}

// Helper functions for case transformations
function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export async function renameFile(
  oldPath: string,
  newPath: string
): Promise<RenameResult> {
  try {
    // Use camelCase parameter names consistently
    await invoke('rename_file', {
      oldPath,
      newPath
    });
    
    return { success: true };
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new FileSystemError(
      `Failed to rename file: ${error instanceof Error ? error.message : String(error)}`,
      'RENAME_ERROR',
      error instanceof Error ? error : undefined
    );
  }
}

// Function that applies find and replace text transformation
export const applyReplaceRule = (text: string, find: string, replace: string, useRegex: boolean = false): string => {
  if (!find) return text;

  let result = text;

  try {
    if (useRegex) {
      const regex = new RegExp(find, 'g');
      result = result.replace(regex, replace);
    } else {
      result = result.split(find).join(replace);
    }
  } catch (error) {
    console.error('Invalid regex pattern:', error);
    throw new Error(`Failed to apply pattern: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
};

// Apply case transformation to text
export const applyCaseTransformation = (text: string, transformationType: string): string => {
  if (!text) return text;

  try {
    switch (transformationType) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'capitalize':
        return text.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      case 'title_case':
        return text.split(' ')
          .map(word => {
            // Don't capitalize small words in title case
            if (word.length <= 2) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(' ');
      case 'sentence_case':
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      case 'camel_case':
        return text.split(' ')
          .map((word, index) => {
            if (index === 0) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join('');
      case 'pascal_case':
        return text.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join('');
      case 'snake_case':
        return text.toLowerCase().replace(/\s+/g, '_');
      case 'kebab_case':
        return text.toLowerCase().replace(/\s+/g, '-');
      default:
        return text;
    }
  } catch (error) {
    console.error('Error in text replacement:', error);
    return text; // Return original if transformation fails
  }
}; 