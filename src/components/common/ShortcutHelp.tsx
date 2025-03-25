import React, { useState } from 'react';

interface ShortcutHelpProps {
  className?: string;
}

interface ShortcutItem {
  key: string;
  description: string;
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
}

const shortcuts: ShortcutItem[] = [
  { key: 'A', description: 'Select all files', modifiers: { ctrl: true } },
  { key: 'P', description: 'Toggle preview mode', modifiers: { ctrl: true } },
  { key: 'C', description: 'Clear all files', modifiers: { ctrl: true, shift: true } },
  { key: 'Escape', description: 'Deselect all files' },
];

const ShortcutHelp: React.FC<ShortcutHelpProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-2 rounded-full"
        onClick={toggleHelp}
        title="Keyboard shortcuts"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Keyboard Shortcuts</h3>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={toggleHelp}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  {shortcut.description}
                </span>
                <div className="flex space-x-1">
                  {shortcut.modifiers?.ctrl && (
                    <kbd className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                      Ctrl
                    </kbd>
                  )}
                  {shortcut.modifiers?.shift && (
                    <kbd className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                      Shift
                    </kbd>
                  )}
                  {shortcut.modifiers?.alt && (
                    <kbd className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                      Alt
                    </kbd>
                  )}
                  <kbd className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortcutHelp; 