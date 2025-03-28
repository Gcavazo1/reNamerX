import { useEffect } from 'react';
import { useFileStore } from '../stores/fileStore';
import { useRulesStore } from '../stores/rulesStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useHistoryStore } from '../stores/historyStore';
import { useError } from '../context/ErrorContext';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

// Keep track of all active handlers for cleanup
const activeHandlers: { handler: EventListener; type: string }[] = [];

/**
 * Unregister all keyboard shortcuts
 * This is used during app shutdown to ensure proper cleanup
 */
export function unregisterAllShortcuts() {
  console.log(`Unregistering ${activeHandlers.length} keyboard shortcuts`);
  
  activeHandlers.forEach(({ handler, type }) => {
    window.removeEventListener(type, handler);
  });
  
  // Clear the array
  activeHandlers.length = 0;
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
    const handleKeyDown = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      const { ctrl = false, alt = false, shift = false } = options;
      
      if (
        keyEvent.key.toLowerCase() === key.toLowerCase() &&
        keyEvent.ctrlKey === ctrl &&
        keyEvent.altKey === alt &&
        keyEvent.shiftKey === shift
      ) {
        handler(keyEvent);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Track this handler for global cleanup
    activeHandlers.push({ handler: handleKeyDown, type: 'keydown' });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Remove from activeHandlers array
      const index = activeHandlers.findIndex(item => item.handler === handleKeyDown);
      if (index !== -1) {
        activeHandlers.splice(index, 1);
      }
    };
  }, [key, handler, options]);
}

/**
 * List of all available keyboard shortcuts with descriptions for the help panel
 */
export const KEYBOARD_SHORTCUTS = [
  // File operations
  { key: 'A', description: 'Select all files', modifiers: { ctrl: true } },
  { key: 'N', description: 'Invert selection', modifiers: { ctrl: true } },
  { key: 'O', description: 'Open files', modifiers: { ctrl: true } },
  { key: 'D', description: 'Open directory', modifiers: { ctrl: true } },
  { key: 'K', description: 'Clear selected files', modifiers: { ctrl: true } },
  { key: 'Escape', description: 'Deselect all files' },
  
  // Undo/Redo operations
  { key: 'Z', description: 'Undo', modifiers: { ctrl: true } },
  { key: 'Y', description: 'Redo', modifiers: { ctrl: true } },
  { key: 'Z', description: 'Redo (alternative)', modifiers: { ctrl: true, shift: true } },
  
  // Preview and rename operations
  { key: 'P', description: 'Toggle preview mode', modifiers: { ctrl: true } },
  { key: 'R', description: 'Apply rename', modifiers: { ctrl: true, shift: true } },
  
  // Rule operations
  { key: 'S', description: 'Save current rules as preset', modifiers: { ctrl: true, alt: true } },
  
  // UI Toggles
  { key: 'T', description: 'Toggle dark/light theme', modifiers: { ctrl: true, shift: true } },
  { key: 'H', description: 'Show keyboard shortcuts', modifiers: { ctrl: true } },
  { key: '/', description: 'Focus search box', modifiers: { ctrl: true } },
];

/**
 * Register application shortcuts with improved keyboard event handling
 */
export function useAppShortcuts() {
  const { 
    files, 
    selectAll: selectAllFiles, 
    deselectAll: deselectAllFiles, 
    setPreviewMode, 
    previewMode,
    clearFiles,
    selectedFiles
  } = useFileStore();
  
  const { 
    resetRules,
    updateNumbering,
    rules,
    savePreset
  } = useRulesStore();
  
  const { toggleDarkMode } = useSettingsStore();
  
  const historyStore = useHistoryStore();
  
  const { handleError } = useError();
  
  // Function to toggle selection of files
  const invertSelection = () => {
    const allFileIds = files.map(file => file.id);
    const newSelection = allFileIds.filter(id => !selectedFiles.includes(id));
    deselectAllFiles();
    newSelection.forEach(id => {
      const selectFileFn = (window as any).__selectFile;
      if (typeof selectFileFn === 'function') {
        selectFileFn(id);
      }
    });
  };
  
  const toggleAutoNumbering = () => {
    updateNumbering(!rules.numbering.enabled);
  };
  
  const focusSearchBox = () => {
    const searchInputEl = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInputEl) {
      searchInputEl.focus();
    }
  };
  
  const showShortcutHelp = () => {
    const helpButtonEl = document.querySelector('[title="Keyboard shortcuts"]') as HTMLElement;
    if (helpButtonEl) helpButtonEl.click();
  };
  
  useEffect(() => {
    console.log("Registering global keyboard shortcuts");
    
    // Global event handler for all keyboard shortcuts
    const handleKeyDown = async (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      
      // Ignore shortcuts when typing in input fields, textareas, etc.
      if (keyEvent.target instanceof HTMLInputElement || 
          keyEvent.target instanceof HTMLTextAreaElement || 
          keyEvent.target instanceof HTMLSelectElement) {
        return;
      }
      
      // File Operations
      
      // Select all files (Ctrl+A)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'a') {
        keyEvent.preventDefault();
        selectAllFiles();
      }
      
      // Invert selection (Ctrl+N)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'n') {
        keyEvent.preventDefault();
        invertSelection();
      }
      
      // Toggle preview mode (Ctrl+P)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'p') {
        keyEvent.preventDefault();
        setPreviewMode(previewMode === 'list' ? 'side-by-side' : 'list');
      }
      
      // Clear selected files (Ctrl+K)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'k') {
        keyEvent.preventDefault();
        clearFiles();
      }
      
      // Deselect all files (Escape)
      if (!keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key === 'Escape') {
        keyEvent.preventDefault();
        deselectAllFiles();
      }
      
      // Rule Operations
      
      // Save current rules as preset (Ctrl+Alt+S)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && keyEvent.altKey && keyEvent.key.toLowerCase() === 's') {
        keyEvent.preventDefault();
        try {
          await savePreset('Quick Save');
        } catch (e) {
          handleError(
            'Failed to save preset',
            'error',
            e instanceof Error ? e.stack : undefined
          );
        }
      }
      
      // UI Toggles
      
      // Toggle dark/light theme (Ctrl+Shift+T)
      if (keyEvent.ctrlKey && keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 't') {
        keyEvent.preventDefault();
        toggleDarkMode();
      }
      
      // Show keyboard shortcuts (Ctrl+H)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'h') {
        keyEvent.preventDefault();
        showShortcutHelp();
      }
      
      // Focus search box (Ctrl+/)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key === '/') {
        keyEvent.preventDefault();
        focusSearchBox();
      }
      
      // History operations
      
      // Undo (Ctrl+Z)
      if (keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'z') {
        keyEvent.preventDefault();
        console.log("Ctrl+Z pressed - triggering undo");
        await historyStore.undo();
      }
      
      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if ((keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'y') ||
          (keyEvent.ctrlKey && keyEvent.shiftKey && !keyEvent.altKey && keyEvent.key.toLowerCase() === 'z')) {
        keyEvent.preventDefault();
        console.log("Redo shortcut pressed - triggering redo");
        await historyStore.redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Add to active handlers list for global cleanup
    activeHandlers.push({ handler: handleKeyDown, type: 'keydown' });
    
    // Return cleanup function
    return () => {
      console.log("Cleaning up global keyboard shortcuts");
      window.removeEventListener('keydown', handleKeyDown);
      
      // Remove from active handlers
      const index = activeHandlers.findIndex(item => item.handler === handleKeyDown);
      if (index !== -1) {
        activeHandlers.splice(index, 1);
      }
    };
  }, [
    selectAllFiles, 
    deselectAllFiles, 
    setPreviewMode,
    previewMode,
    clearFiles,
    files,
    selectedFiles,
    resetRules,
    updateNumbering,
    rules, 
    savePreset,
    toggleDarkMode,
    historyStore,
    handleError
  ]);
} 