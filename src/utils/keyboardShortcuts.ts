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
    selectAllFiles, 
    deselectAllFiles, 
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
  
  const { undo, redo } = useHistoryStore();
  
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
    // Global event handler for all keyboard shortcuts
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields, textareas, etc.
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLSelectElement) {
        return;
      }
      
      // File Operations
      
      // Select all files (Ctrl+A)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAllFiles();
      }
      
      // Invert selection (Ctrl+N)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        invertSelection();
      }
      
      // Toggle preview mode (Ctrl+P)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPreviewMode(!previewMode);
      }
      
      // Clear selected files (Ctrl+K)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        clearFiles();
      }
      
      // Deselect all files (Escape)
      if (!e.ctrlKey && !e.shiftKey && !e.altKey && e.key === 'Escape') {
        e.preventDefault();
        deselectAllFiles();
      }
      
      // Rule Operations
      
      // Save current rules as preset (Ctrl+Alt+S)
      if (e.ctrlKey && !e.shiftKey && e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        try {
          await savePreset();
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
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleDarkMode();
      }
      
      // Show keyboard shortcuts (Ctrl+H)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        showShortcutHelp();
      }
      
      // Focus search box (Ctrl+/)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key === '/') {
        e.preventDefault();
        focusSearchBox();
      }
      
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        await undo();
      }
      
      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        await redo();
      }
    };
    
    // Add the global event listener
    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [
    files, previewMode, selectedFiles, rules, 
    selectAllFiles, deselectAllFiles, setPreviewMode, clearFiles,
    resetRules, updateNumbering, toggleDarkMode, savePreset, undo, redo, handleError
  ]);
} 