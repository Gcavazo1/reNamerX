import { fireEvent } from '@testing-library/react';
import { useKeyboardShortcut, useAppShortcuts } from '../utils/keyboardShortcuts';
import { renderHook } from '@testing-library/react-hooks';
import { useFileStore } from '../stores/fileStore';

// Create a mock for the file store
jest.mock('../stores/fileStore', () => ({
  useFileStore: jest.fn().mockReturnValue({
    files: [],
    selectAllFiles: jest.fn(),
    deselectAllFiles: jest.fn(),
    setPreviewMode: jest.fn(),
    previewMode: false,
    clearFiles: jest.fn()
  })
}));

describe('Keyboard Shortcuts', () => {
  describe('useKeyboardShortcut', () => {
    test('should call handler when shortcut is pressed', () => {
      const mockHandler = jest.fn();
      
      renderHook(() => useKeyboardShortcut('a', mockHandler, { ctrl: true }));
      
      // Simulate pressing Ctrl+A
      fireEvent.keyDown(window, { 
        key: 'a', 
        code: 'KeyA', 
        ctrlKey: true,
        altKey: false,
        shiftKey: false
      });
      
      expect(mockHandler).toHaveBeenCalled();
    });
    
    test('should not call handler when different key is pressed', () => {
      const mockHandler = jest.fn();
      
      renderHook(() => useKeyboardShortcut('a', mockHandler, { ctrl: true }));
      
      // Simulate pressing Ctrl+B (not the registered shortcut)
      fireEvent.keyDown(window, { 
        key: 'b', 
        code: 'KeyB', 
        ctrlKey: true 
      });
      
      expect(mockHandler).not.toHaveBeenCalled();
    });
    
    test('should not call handler when modifier keys do not match', () => {
      const mockHandler = jest.fn();
      
      renderHook(() => useKeyboardShortcut('a', mockHandler, { ctrl: true, shift: true }));
      
      // Simulate pressing only Ctrl+A (without Shift)
      fireEvent.keyDown(window, { 
        key: 'a', 
        code: 'KeyA', 
        ctrlKey: true,
        altKey: false,
        shiftKey: false
      });
      
      expect(mockHandler).not.toHaveBeenCalled();
    });
    
    test('should handle key case insensitively', () => {
      const mockHandler = jest.fn();
      
      // Register with lowercase 'a'
      renderHook(() => useKeyboardShortcut('a', mockHandler, { ctrl: true }));
      
      // Simulate pressing Ctrl+A (uppercase)
      fireEvent.keyDown(window, { 
        key: 'A', 
        code: 'KeyA', 
        ctrlKey: true 
      });
      
      expect(mockHandler).toHaveBeenCalled();
    });
  });
  
  describe('useAppShortcuts', () => {
    // Reset the mocks before each test
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Reset window.confirm mock
      (window.confirm as jest.Mock).mockReset();
      (window.confirm as jest.Mock).mockReturnValue(true);
    });
    
    test('should register Ctrl+A to select all files', () => {
      const { selectAllFiles } = useFileStore();
      
      renderHook(() => useAppShortcuts());
      
      // Simulate pressing Ctrl+A
      fireEvent.keyDown(window, { 
        key: 'a', 
        code: 'KeyA', 
        ctrlKey: true 
      });
      
      expect(selectAllFiles).toHaveBeenCalled();
    });
    
    test('should register Ctrl+P to toggle preview mode', () => {
      const { setPreviewMode, previewMode } = useFileStore();
      
      renderHook(() => useAppShortcuts());
      
      // Simulate pressing Ctrl+P
      fireEvent.keyDown(window, { 
        key: 'p', 
        code: 'KeyP', 
        ctrlKey: true 
      });
      
      expect(setPreviewMode).toHaveBeenCalledWith(!previewMode);
    });
    
    test('should register Escape to deselect all files', () => {
      const { deselectAllFiles } = useFileStore();
      
      renderHook(() => useAppShortcuts());
      
      // Simulate pressing Escape
      fireEvent.keyDown(window, { 
        key: 'Escape', 
        code: 'Escape' 
      });
      
      expect(deselectAllFiles).toHaveBeenCalled();
    });
    
    test('should register Ctrl+Shift+C to clear files with confirmation', () => {
      const { clearFiles } = useFileStore();
      const { files } = useFileStore();
      
      // Mock files array to contain some files
      (files as any).length = 3;
      
      renderHook(() => useAppShortcuts());
      
      // Simulate pressing Ctrl+Shift+C
      fireEvent.keyDown(window, { 
        key: 'c', 
        code: 'KeyC', 
        ctrlKey: true,
        shiftKey: true 
      });
      
      expect(window.confirm).toHaveBeenCalled();
      expect(clearFiles).toHaveBeenCalled();
    });
    
    test('should not clear files if confirmation is canceled', () => {
      const { clearFiles } = useFileStore();
      const { files } = useFileStore();
      
      // Mock files array to contain some files
      (files as any).length = 3;
      
      // Mock window.confirm to return false (user canceled)
      (window.confirm as jest.Mock).mockReturnValue(false);
      
      renderHook(() => useAppShortcuts());
      
      // Simulate pressing Ctrl+Shift+C
      fireEvent.keyDown(window, { 
        key: 'c', 
        code: 'KeyC', 
        ctrlKey: true,
        shiftKey: true 
      });
      
      expect(window.confirm).toHaveBeenCalled();
      expect(clearFiles).not.toHaveBeenCalled();
    });
    
    test('should not show confirmation if no files to clear', () => {
      const { clearFiles } = useFileStore();
      const { files } = useFileStore();
      
      // Mock files array to be empty
      (files as any).length = 0;
      
      renderHook(() => useAppShortcuts());
      
      // Simulate pressing Ctrl+Shift+C
      fireEvent.keyDown(window, { 
        key: 'c', 
        code: 'KeyC', 
        ctrlKey: true,
        shiftKey: true 
      });
      
      expect(window.confirm).not.toHaveBeenCalled();
      expect(clearFiles).not.toHaveBeenCalled();
    });
  });
}); 