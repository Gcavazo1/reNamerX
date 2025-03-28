import React, { useState, useEffect } from 'react';
import { useFileFilterStore } from '../../stores/fileFilterStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useFileStore } from '../../stores/fileStore';

const FileTypeFilter: React.FC = () => {
  const { 
    activeFilter, 
    setActiveFilter,
    getAvailableFilters,
    isFileTypeMatched 
  } = useFileFilterStore();
  const { lastActiveFileFilter, setLastActiveFileFilter } = useSettingsStore();
  const { files } = useFileStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize from settings when component mounts
  useEffect(() => {
    if (lastActiveFileFilter && lastActiveFileFilter !== activeFilter) {
      setActiveFilter(lastActiveFileFilter);
    }
  }, [lastActiveFileFilter, activeFilter, setActiveFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setLastActiveFileFilter(filter);
    setIsDropdownOpen(false);
  };

  // Calculate file counts for each filter
  const getFilteredCount = (extensions: string[]) => {
    // Ensure files is an array before filtering
    if (!Array.isArray(files)) {
      console.error('Expected files to be an array but got:', files);
      return 0;
    }
    
    if (extensions.length === 0) return files.length;
    return files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      return extensions.includes(extension);
    }).length;
  };

  // Get the icon for the currently active filter
  const getIcon = () => {
    const group = getAvailableFilters().find(g => g.name === activeFilter);
    return group?.icon || 'file';
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-between items-center w-48 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        id="file-type-filter-button"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="flex items-center">
          <IconByType type={getIcon()} className="mr-2 h-4 w-4" />
          {activeFilter}
        </span>
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop to capture clicks outside */}
          <div 
            className="fixed inset-0 z-20"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div 
            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-30 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="file-type-filter-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              {getAvailableFilters().map((group) => {
                const count = getFilteredCount(group.extensions);
                const hasFiles = count > 0;
                
                return (
                  <button
                    key={group.name}
                    className={`
                      ${activeFilter === group.name 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-200'
                      } 
                      group flex items-center w-full px-4 py-2 text-sm
                      ${hasFiles 
                        ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' 
                        : 'opacity-50 cursor-not-allowed'
                      }
                      transition-colors duration-150
                    `}
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => hasFiles && handleFilterChange(group.name)}
                    disabled={!hasFiles}
                  >
                    <IconByType type={group.icon || 'file'} className={`
                      mr-3 h-5 w-5
                      ${activeFilter === group.name
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `} />
                    <span className="flex-1">{group.name}</span>
                    <span className={`
                      ml-2 text-xs px-1.5 py-0.5 rounded-full
                      ${activeFilter === group.name
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                      transition-colors duration-150
                    `}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper component to display the appropriate icon based on file type
const IconByType: React.FC<{ type: string, className?: string }> = ({ type, className = '' }) => {
  switch (type) {
    case 'image':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    case 'video':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    case 'audio':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      );
    case 'document':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    case 'archive':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
  }
};

export default FileTypeFilter; 