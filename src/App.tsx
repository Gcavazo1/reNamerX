import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  FileList, 
  FileSelector, 
  PreviewPanel,
  RulesContainer,
  Header,
  DirectoryBrowser,
  ThemeToggle,
  UndoManager
} from './components';
import ShortcutHelp from './components/common/ShortcutHelp';
import { useAppShortcuts, unregisterAllShortcuts } from './utils/keyboardShortcuts';
import ErrorBoundary from './components/common/ErrorBoundary';
import ErrorProvider from './context/ErrorContext';
import { useSettingsStore } from './stores/settingsStore';
import { useRulesStore } from './stores/rulesStore';
import { useFileStore } from './stores/fileStore';
import { useFileFilterStore } from './stores/fileFilterStore';
import { useHistoryStore } from './stores/historyStore';

// Create a hook wrapper that we can use inside the ErrorProvider
const KeyboardShortcutsWrapper = () => {
  // Register keyboard shortcuts
  const shortcuts = useAppShortcuts();
  
  // Clean up keyboard shortcuts on unmount
  useEffect(() => {
    return () => {
      unregisterAllShortcuts();
    };
  }, []);
  
  return null;
};

function App() {
  const { darkMode, toggleDarkMode } = useSettingsStore();
  const { initializeFromSettings } = useRulesStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize settings
  useEffect(() => {
    // Initialize presets from persistent storage
    initializeFromSettings();
    
    // Expose functions for keyboard shortcuts
    useFileStore.getState().exposeKeyboardShortcutFunctions();
    
    // Reset file filter to prevent issues with stuck filter
    useFileFilterStore.getState().resetFilter();
    
    setIsInitialized(true);
    
    // Cleanup function for component unmount
    return () => {
      // Clear any active state
      useFileStore.getState().clearFiles();
      useHistoryStore.getState().clearHistory();
      
      // Persist settings if needed
      useSettingsStore.getState().saveSettings();
      
      console.log("App component cleanup completed");
    };
  }, [initializeFromSettings]);

  // Apply the theme to the document
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'cyberpunk';
  }, [darkMode]);

  // Wait until initialization is complete
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </ErrorBoundary>
    </ErrorProvider>
  );
}

// Extract the main content to a separate component to use hooks within ErrorProvider
function AppContent({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  // Reset file filter on app load
  useEffect(() => {
    // Reset filter to "All Files" when app loads
    useFileFilterStore.getState().resetFilter();
    
    // Cleanup function for AppContent unmount
    return () => {
      // Cancel any pending operations
      console.log("AppContent cleanup: canceling pending operations");
    };
  }, []);
  
  // Register keyboard shortcuts via the wrapper component
  return (
    <Layout>
      {/* This component uses the ErrorContext */}
      <KeyboardShortcutsWrapper />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="logo-part">re</span>
          <span className="logo-main">Namer</span>
          <span className="logo-x">X</span>
        </h1>
        <div className="flex items-center space-x-2">
          <UndoManager />
          <ShortcutHelp />
          <button 
            onClick={toggleDarkMode}
            className={`flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm theme-toggle-button ${!darkMode ? 'dark-mode' : ''}`}
          >
            {darkMode ? (
              <span>⚡ Cyberpunk Theme</span>
            ) : (
              <span>🌙 Dark Theme</span>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Files</h2>
          <ErrorBoundary>
            <FileSelector />
          </ErrorBoundary>
          <ErrorBoundary>
            <FileList />
          </ErrorBoundary>
          <ErrorBoundary>
            <PreviewPanel />
          </ErrorBoundary>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Renaming Rules</h2>
          <ErrorBoundary>
            <RulesContainer />
          </ErrorBoundary>
        </div>
      </div>
    </Layout>
  );
}

export default App;
