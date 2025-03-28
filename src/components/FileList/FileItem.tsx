import React, { useState, useEffect } from 'react';
import { useFileStore } from '../../stores/fileStore';
import { useRulesStore } from '../../stores/rulesStore';
import { IFile } from '../../types/file';
import { formatFileSize } from '../../utils/fileUtils';

interface FileItemProps {
  file: IFile;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, isSelected, onToggleSelect }) => {
  return (
    <div 
      className={`
        p-2 border-b border-gray-200 dark:border-gray-700 flex items-center
        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
      `}
    >
      <div className="mr-3">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          checked={isSelected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.name}
        </p>
      </div>
      <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 ml-3">
        {file.type}
      </div>
      <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 ml-3 w-20 text-right">
        {formatFileSize(file.size)}
      </div>
    </div>
  );
};

export default FileItem; 