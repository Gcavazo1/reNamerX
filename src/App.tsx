import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  FileList, 
  FileSelector, 
  PreviewPanel,
  RulesContainer
} from './components';
import { useAppShortcuts } from './utils/keyboardShortcuts';

function App() {
  const [theme, setTheme] = useState<'dark' | 'cyberpunk'>('dark');

  // Register keyboard shortcuts
  useAppShortcuts();

  // Apply the theme to the document
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'cyberpunk' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="logo-part">re</span>
          <span className="logo-main">Namer</span>
          <span className="logo-x">X</span>
        </h1>
        <button 
          onClick={toggleTheme}
          className={`flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm theme-toggle-button ${theme === 'cyberpunk' ? 'dark-mode' : ''}`}
        >
          {theme === 'dark' ? (
            <span>⚡ Cyberpunk Theme</span>
          ) : (
            <span>🌙 Dark Theme</span>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Files</h2>
          <FileSelector />
          <FileList />
          <PreviewPanel />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Renaming Rules</h2>
          <RulesContainer />
        </div>
      </div>
    </Layout>
  );
}

export default App;
