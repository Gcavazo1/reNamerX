import { NumberFormat } from "../../stores/rulesStore";
import { CaseType } from "../../stores/rulesStore";

/**
 * Formats a number according to the specified format
 */
export const formatNumber = (
  num: number, 
  format: NumberFormat, 
  customPadding?: number
): string => {
  switch (format) {
    case 'single':
      return num.toString();
      
    case 'double':
      return num.toString().padStart(2, '0');
      
    case 'triple':
      return num.toString().padStart(3, '0');
      
    case 'custom':
      if (customPadding !== undefined && customPadding > 0) {
        return num.toString().padStart(customPadding, '0');
      }
      return num.toString();
      
    default:
      return num.toString();
  }
};

/**
 * Gets the next number in a sequence
 */
export const getNextNumber = (
  index: number,
  start: number,
  increment: number
): number => {
  return start + (index * increment);
};

/**
 * Inserts a number into a string at the specified position
 * Now respects the case format when inserting and detects existing formats
 */
export const insertNumberAtPosition = (
  str: string, 
  num: string, 
  position: 'prefix' | 'suffix' | 'custom', 
  customPosition?: number,
  caseType?: CaseType
): string => {
  // Handle separator based on case type or detect from string pattern
  let separator = '';
  
  // If caseType is explicitly provided, use its separator
  if (caseType) {
    switch (caseType) {
      case 'snakeCase':
        separator = '_';
        break;
      case 'kebabCase':
        separator = '-';
        break;
      default:
        separator = '';
    }
  } 
  // Otherwise try to detect the format from the string itself
  else {
    // Check if the string contains snake_case or kebab-case pattern
    if (str.includes('_') && !str.includes('-')) {
      separator = '_'; // It appears to be snake_case
    } else if (str.includes('-') && !str.includes('_')) {
      separator = '-'; // It appears to be kebab-case
    }
    // Default is no separator if we can't detect a specific pattern
  }

  switch (position) {
    case 'prefix':
      // When adding as prefix, the separator goes after the number
      return separator 
        ? `${num}${separator}${str}`
        : `${num}${str}`;
      
    case 'suffix':
      // When adding as suffix, the separator goes before the number
      return separator
        ? `${str}${separator}${num}`
        : `${str}${num}`;
      
    case 'custom':
      if (customPosition !== undefined && customPosition >= 0 && customPosition <= str.length) {
        // For custom position, we need to determine if we're inserting between words
        // and use the appropriate separator
        if (separator) {
          const beforeChar = customPosition > 0 ? str.charAt(customPosition - 1) : '';
          const afterChar = customPosition < str.length ? str.charAt(customPosition) : '';
          
          // Only add separators if we're not already at a word boundary
          const needsPrefixSeparator = customPosition > 0 && beforeChar !== separator;
          const needsSuffixSeparator = customPosition < str.length && afterChar !== separator;
          
          return `${str.slice(0, customPosition)}${needsPrefixSeparator ? separator : ''}${num}${needsSuffixSeparator ? separator : ''}${str.slice(customPosition)}`;
        }
        return `${str.slice(0, customPosition)}${num}${str.slice(customPosition)}`;
      }
      return `${str}${num}`; // Default to suffix if invalid position
      
    default:
      return `${str}${num}`; // Default to suffix
  }
}; 