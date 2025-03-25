import { CaseType } from "../../stores/rulesStore";

/**
 * Normalizes a string by removing special characters and replacing them with spaces
 * Also adds spaces at letter case transitions to better handle CamelCase/PascalCase input
 */
export const normalizeString = (str: string): string => {
  // First detect camelCase/PascalCase transitions and add spaces
  // This handles input like "myFileName" -> "my File Name"
  const withCaseSpaces = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Then replace special characters and multiple spaces with a single space
  return withCaseSpaces
    .replace(/[^\w\s-]/g, ' ')  // Replace special chars with space
    .replace(/[-_]/g, ' ')      // Replace hyphens and underscores with space
    .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
    .trim();
};

/**
 * Transforms a string to different cases based on the specified caseType
 */
export const transformCase = (str: string, caseType: CaseType): string => {
  if (!str) return str;
  
  // Make sure we always start with a well-normalized string
  const normalized = normalizeString(str);
  const words = normalized.split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return str;
  
  switch (caseType) {
    case 'camelCase':
      return words
        .map((word, index) => {
          if (index === 0) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
      
    case 'pascalCase':
      return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
      
    case 'snakeCase':
      return words
        .map(word => word.toLowerCase())
        .join('_');
      
    case 'kebabCase':
      return words
        .map(word => word.toLowerCase())
        .join('-');
      
    case 'upperCase':
      return normalized.toUpperCase();
      
    case 'lowerCase':
      return normalized.toLowerCase();
      
    default:
      return str;
  }
};

/**
 * Extracts the file name without extension from a full file path
 */
export const getFileNameWithoutExtension = (filePath: string): string => {
  const fileName = filePath.split(/[\\/]/).pop() || '';
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
};

/**
 * Gets the file extension (including the dot)
 */
export const getFileExtension = (filePath: string): string => {
  const fileName = filePath.split(/[\\/]/).pop() || '';
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex > 0 ? fileName.slice(lastDotIndex) : '';
}; 