import { useEffect } from 'react';
import { useFileStore } from '../stores/fileStore';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

/**
 * Register a keyboard shortcut
 * 
 * @param key The key to listen for
 * @param handler The function to call when the shortcut is triggered
 * @param options Options for modifier keys
 */
export function useKeyboardShortcut(
  key: string,
  handler: ShortcutHandler,
  options: ShortcutOptions = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { ctrl = false, alt = false, shift = false } = options;
      
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        e.ctrlKey === ctrl &&
        e.altKey === alt &&
        e.shiftKey === shift
      ) {
        handler(e);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, handler, options]);
}

/**
 * Register application shortcuts with improved keyboard event handling
 */
export function useAppShortcuts() {
  const { 
    files, 
    selectAllFiles, 
    deselectAllFiles, 
    setPreviewMode, 
    previewMode,
    clearFiles
  } = useFileStore();
  
  useEffect(() => {
    // Global event handler for all keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Select all files (Ctrl+A)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAllFiles();
      }
      
      // Toggle preview mode (Ctrl+P)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPreviewMode(!previewMode);
      }
      
      // Clear all files (Ctrl+Shift+C)
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        e.stopPropagation(); // Stop event bubbling
        console.log("Ctrl+Shift+C detected - clearing files");
        
        if (files.length > 0) {
          if (window.confirm('Are you sure you want to clear all files?')) {
            clearFiles();
          }
        }
      }
      
      // Deselect all files (Escape)
      if (!e.ctrlKey && !e.shiftKey && !e.altKey && e.key === 'Escape') {
        deselectAllFiles();
      }
    };
    
    // Add the global event listener
    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [files, previewMode, selectAllFiles, deselectAllFiles, setPreviewMode, clearFiles]);
} 