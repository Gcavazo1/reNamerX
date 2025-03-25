import { IRules } from "../../stores/rulesStore";
import { IFile } from "../../types/file";
import { transformCase } from "../formatters/caseFormatters";
import { formatNumber, getNextNumber, insertNumberAtPosition } from "../formatters/numberFormatters";
import { sanitizeFileName, isValidFileName } from "../validators/fileNameValidator";
import { getFileNameWithoutExtension, getFileExtension } from "../formatters/caseFormatters";

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
    // Extract existing number if present
    const { baseName, number } = extractNumberFromFileName(result);
    
    // If we want to replace existing numbers, use the base name
    if (number !== null) {
      result = baseName;
    }
    
    const num = getNextNumber(index, rules.numbering.start, rules.numbering.increment);
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
 * Generates preview of renamed files
 */
export const generatePreview = (
  files: IFile[],
  rules: IRules
): IPreviewResult[] => {
  console.log("Generating preview with rules:", rules);
  
  return files.map((file, index) => {
    try {
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
      console.error(`Error generating preview for ${file.name}:`, error);
      return {
        fileId: file.id,
        originalName: file.name,
        newName: file.name,
        isValid: false,
        error: 'Error generating preview'
      };
    }
  });
}; 