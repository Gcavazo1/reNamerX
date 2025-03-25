import { act, renderHook } from '@testing-library/react-hooks';
import { useFileStore } from '../stores/fileStore';
import { IFile } from '../types/file';

const createMockFile = (id: string, name: string): IFile => ({
  id,
  name,
  originalName: name,
  path: `/path/to/${name}`,
  type: name.split('.').pop() || '',
  size: 1024,
  isDirectory: false
});

describe('FileStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useFileStore());
    act(() => {
      result.current.clearFiles();
    });
  });

  test('should add files to the store', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles = [
      createMockFile('1', 'file1.txt'),
      createMockFile('2', 'file2.jpg')
    ];
    
    act(() => {
      result.current.addFiles(mockFiles);
    });
    
    expect(result.current.files.length).toBe(2);
    expect(result.current.files[0].name).toBe('file1.txt');
    expect(result.current.files[1].name).toBe('file2.jpg');
    
    // Should auto-select added files
    expect(result.current.selectedFiles.length).toBe(2);
    expect(result.current.selectedFiles).toContain('1');
    expect(result.current.selectedFiles).toContain('2');
  });
  
  test('should avoid adding duplicate files', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles1 = [createMockFile('1', 'file1.txt')];
    const mockFiles2 = [createMockFile('1', 'file1.txt')]; // Same path
    
    act(() => {
      result.current.addFiles(mockFiles1);
      result.current.addFiles(mockFiles2);
    });
    
    expect(result.current.files.length).toBe(1);
  });
  
  test('should remove a file from the store', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles = [
      createMockFile('1', 'file1.txt'),
      createMockFile('2', 'file2.jpg')
    ];
    
    act(() => {
      result.current.addFiles(mockFiles);
      result.current.removeFile('1');
    });
    
    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].name).toBe('file2.jpg');
    
    // Should remove file from selection as well
    expect(result.current.selectedFiles.length).toBe(1);
    expect(result.current.selectedFiles).not.toContain('1');
    expect(result.current.selectedFiles).toContain('2');
  });
  
  test('should clear all files from the store', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles = [
      createMockFile('1', 'file1.txt'),
      createMockFile('2', 'file2.jpg')
    ];
    
    act(() => {
      result.current.addFiles(mockFiles);
      result.current.clearFiles();
    });
    
    expect(result.current.files.length).toBe(0);
    expect(result.current.selectedFiles.length).toBe(0);
  });
  
  test('should select and deselect files', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles = [
      createMockFile('1', 'file1.txt'),
      createMockFile('2', 'file2.jpg'),
      createMockFile('3', 'file3.png')
    ];
    
    act(() => {
      result.current.addFiles(mockFiles);
      // Clear selection first
      result.current.deselectAllFiles();
      
      // Now select individual files
      result.current.selectFile('1');
      result.current.selectFile('3');
    });
    
    expect(result.current.selectedFiles.length).toBe(2);
    expect(result.current.selectedFiles).toContain('1');
    expect(result.current.selectedFiles).not.toContain('2');
    expect(result.current.selectedFiles).toContain('3');
    
    act(() => {
      result.current.deselectFile('1');
    });
    
    expect(result.current.selectedFiles.length).toBe(1);
    expect(result.current.selectedFiles).not.toContain('1');
    expect(result.current.selectedFiles).toContain('3');
  });
  
  test('should select all files', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles = [
      createMockFile('1', 'file1.txt'),
      createMockFile('2', 'file2.jpg'),
      createMockFile('3', 'file3.png')
    ];
    
    act(() => {
      result.current.addFiles(mockFiles);
      result.current.deselectAllFiles();
      result.current.selectAllFiles();
    });
    
    expect(result.current.selectedFiles.length).toBe(3);
    expect(result.current.selectedFiles).toContain('1');
    expect(result.current.selectedFiles).toContain('2');
    expect(result.current.selectedFiles).toContain('3');
  });
  
  test('should deselect all files', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles = [
      createMockFile('1', 'file1.txt'),
      createMockFile('2', 'file2.jpg')
    ];
    
    act(() => {
      result.current.addFiles(mockFiles);
      result.current.deselectAllFiles();
    });
    
    expect(result.current.selectedFiles.length).toBe(0);
  });
  
  test('should update file name', () => {
    const { result } = renderHook(() => useFileStore());
    const mockFiles = [createMockFile('1', 'file1.txt')];
    
    act(() => {
      result.current.addFiles(mockFiles);
      result.current.updateFileName('1', 'new_name.txt');
    });
    
    expect(result.current.files[0].newName).toBe('new_name.txt');
    expect(result.current.files[0].originalName).toBe('file1.txt');
  });
  
  test('should toggle preview mode', () => {
    const { result } = renderHook(() => useFileStore());
    
    expect(result.current.previewMode).toBe(false);
    
    act(() => {
      result.current.setPreviewMode(true);
    });
    
    expect(result.current.previewMode).toBe(true);
    
    act(() => {
      result.current.setPreviewMode(false);
    });
    
    expect(result.current.previewMode).toBe(false);
  });
}); 