import { generatePreview } from '../utils/fileOperations/fileRenamer';
import { IFile } from '../types/file';
import { IRules } from '../stores/rulesStore';

// Mock file data for testing
const createMockFiles = (): IFile[] => [
  {
    id: '1',
    name: 'test_file.txt',
    originalName: 'test_file.txt',
    path: '/path/to/test_file.txt',
    type: 'txt',
    size: 1024,
    isDirectory: false
  },
  {
    id: '2',
    name: 'another-file.jpg',
    originalName: 'another-file.jpg',
    path: '/path/to/another-file.jpg',
    type: 'jpg',
    size: 2048,
    isDirectory: false
  },
  {
    id: '3',
    name: 'camelCaseFile.pdf',
    originalName: 'camelCaseFile.pdf',
    path: '/path/to/camelCaseFile.pdf',
    type: 'pdf',
    size: 4096,
    isDirectory: false
  }
];

// Create mock rules for testing different renaming scenarios
const createMockRules = (overrides = {}): IRules => ({
  textOperations: {
    findReplace: {
      enabled: false,
      find: '',
      replace: '',
      useRegex: false,
      caseSensitive: false,
      replaceEntire: false
    },
    prefix: {
      enabled: false,
      text: ''
    },
    suffix: {
      enabled: false,
      text: ''
    },
    removeChars: {
      enabled: false,
      fromStart: 0,
      fromEnd: 0
    }
  },
  caseTransformation: {
    enabled: false,
    type: 'camelCase'
  },
  numbering: {
    enabled: false,
    format: 'simple',
    position: 'suffix',
    startAt: 1,
    increment: 1,
    padding: 2,
    separator: ''
  },
  advanced: {
    dateStamp: {
      enabled: false,
      format: 'YYYY-MM-DD',
      position: 'prefix',
      separator: '_'
    },
    metadata: {
      enabled: false,
      useExif: false,
      useID3: false,
      pattern: '',
      values: null
    }
  },
  ...overrides
});

describe('File Renaming Operations', () => {
  // Test basic text operations
  describe('Text Operations', () => {
    test('Should correctly add a prefix', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        textOperations: {
          ...createMockRules().textOperations,
          prefix: {
            enabled: true,
            text: 'PREFIX_'
          }
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      expect(results[0].newName).toBe('PREFIX_test_file.txt');
      expect(results[1].newName).toBe('PREFIX_another-file.jpg');
      expect(results[2].newName).toBe('PREFIX_camelCaseFile.pdf');
    });
    
    test('Should correctly add a suffix', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        textOperations: {
          ...createMockRules().textOperations,
          suffix: {
            enabled: true,
            text: '_SUFFIX'
          }
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      expect(results[0].newName).toBe('test_file_SUFFIX.txt');
      expect(results[1].newName).toBe('another-file_SUFFIX.jpg');
      expect(results[2].newName).toBe('camelCaseFile_SUFFIX.pdf');
    });
    
    test('Should correctly use find and replace', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        textOperations: {
          ...createMockRules().textOperations,
          findReplace: {
            enabled: true,
            find: 'file',
            replace: 'document',
            useRegex: false,
            caseSensitive: false,
            replaceEntire: false
          }
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      expect(results[0].newName).toBe('test_document.txt');
      expect(results[1].newName).toBe('another-document.jpg');
      expect(results[2].newName).toBe('camelCaseDocument.pdf');
    });
  });
  
  // Test case transformation
  describe('Case Transformation', () => {
    test('Should transform to camelCase', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        caseTransformation: {
          enabled: true,
          type: 'camelCase'
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      expect(results[0].newName).toBe('testFile.txt');
      expect(results[1].newName).toBe('anotherFile.jpg');
      // This file is already camelCase
      expect(results[2].newName).toBe('camelCaseFile.pdf');
    });
    
    test('Should transform to snake_case', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        caseTransformation: {
          enabled: true,
          type: 'snakeCase'
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      // This file is already snake_case
      expect(results[0].newName).toBe('test_file.txt');
      expect(results[1].newName).toBe('another_file.jpg');
      expect(results[2].newName).toBe('camel_case_file.pdf');
    });
  });
  
  // Test numbering
  describe('Numbering', () => {
    test('Should add sequential numbers as suffix', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        numbering: {
          enabled: true,
          format: 'simple',
          position: 'suffix',
          startAt: 1,
          increment: 1,
          padding: 2,
          separator: '_'
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      expect(results[0].newName).toBe('test_file_01.txt');
      expect(results[1].newName).toBe('another-file_02.jpg');
      expect(results[2].newName).toBe('camelCaseFile_03.pdf');
    });
    
    test('Should add sequential numbers as prefix', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        numbering: {
          enabled: true,
          format: 'simple',
          position: 'prefix',
          startAt: 1,
          increment: 1,
          padding: 2,
          separator: '_'
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      expect(results[0].newName).toBe('01_test_file.txt');
      expect(results[1].newName).toBe('02_another-file.jpg');
      expect(results[2].newName).toBe('03_camelCaseFile.pdf');
    });
  });
  
  // Test combined operations
  describe('Combined Operations', () => {
    test('Should apply multiple operations in the correct order', () => {
      const files = createMockFiles();
      const rules = createMockRules({
        textOperations: {
          ...createMockRules().textOperations,
          prefix: {
            enabled: true,
            text: 'doc_'
          }
        },
        caseTransformation: {
          enabled: true,
          type: 'upperCase'
        },
        numbering: {
          enabled: true,
          format: 'simple',
          position: 'suffix',
          startAt: 1,
          increment: 1,
          padding: 2,
          separator: '_'
        }
      });
      
      const results = generatePreview(files, rules);
      expect(results.length).toBe(files.length);
      expect(results[0].newName).toBe('DOC_TEST_FILE_01.txt');
      expect(results[1].newName).toBe('DOC_ANOTHER-FILE_02.jpg');
      expect(results[2].newName).toBe('DOC_CAMELCASEFILE_03.pdf');
    });
  });
}); 