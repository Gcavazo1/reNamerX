import React from 'react';
import { useFileStore } from '../../stores/fileStore';
import { IFile } from '../../types/file';

interface FileListItemProps {
  file: IFile;
}

const FileListItem: React.FC<FileListItemProps> = ({ file }) => {
  const { selectFile, deselectFile, selectedFiles, removeFile } = useFileStore();
  const isSelected = selectedFiles.includes(file.id);

  // Toggle selection
  const toggleSelectFile = (id: string) => {
    if (isSelected) {
      deselectFile(id);
    } else {
      selectFile(id);
    }
  };

  return (
    <tr className={isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
      <td className="px-4 py-2">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={isSelected}
          onChange={() => toggleSelectFile(file.id)}
        />
      </td>
      <td className="px-4 py-2 text-sm">
        <span className="font-mono">{file.name}</span>
      </td>
      <td className="px-4 py-2 text-sm">
        {file.newName ? (
          <span className="font-mono text-green-600 dark:text-green-400">
            {file.newName}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 italic">
            (No change)
          </span>
        )}
      </td>
      <td className="px-4 py-2 text-right">
        <button
          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
          onClick={() => removeFile(file.id)}
          title="Remove file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default FileListItem; 