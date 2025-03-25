import React, { useState } from 'react';
import { useRulesStore, NumberFormat, NumberPosition } from '../../stores/rulesStore';
import { InfoTip } from '../common';

const NumberingRule: React.FC = () => {
  const { rules, updateNumbering } = useRulesStore();
  const { enabled, format, customPadding, position, start, increment, customPosition } = rules.numbering;

  const [showCustomPadding, setShowCustomPadding] = useState<boolean>(format === 'custom');
  const [showCustomPosition, setShowCustomPosition] = useState<boolean>(position === 'custom');

  const handleToggle = () => {
    updateNumbering(!enabled);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value as NumberFormat;
    setShowCustomPadding(newFormat === 'custom');
    updateNumbering(enabled, { format: newFormat });
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPosition = e.target.value as NumberPosition;
    setShowCustomPosition(newPosition === 'custom');
    updateNumbering(enabled, { position: newPosition });
  };

  const handleCustomPaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const padding = parseInt(e.target.value);
    if (!isNaN(padding) && padding >= 1 && padding <= 10) {
      updateNumbering(enabled, { customPadding: padding });
    }
  };

  const handleCustomPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pos = parseInt(e.target.value);
    if (!isNaN(pos) && pos >= 0) {
      updateNumbering(enabled, { customPosition: pos });
    }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startNum = parseInt(e.target.value);
    if (!isNaN(startNum) && startNum >= 0) {
      updateNumbering(enabled, { start: startNum });
    }
  };

  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inc = parseInt(e.target.value);
    if (!isNaN(inc) && inc >= 1) {
      updateNumbering(enabled, { increment: inc });
    }
  };

  // Tooltip contents
  const numberingTip = (
    <>
      <p className="mb-2"><strong>Numbering Tips:</strong></p>
      <ul className="list-disc pl-4 space-y-1">
        <li>Numbers are formatted according to the selected format</li>
        <li>When using snake_case or kebab-case, separators are automatically added</li>
        <li>Numbers will replace any existing numbers in the filenames</li>
        <li><strong>Safety Feature:</strong> Numbering prevents duplicate filenames and data loss</li>
        <li>Use this feature whenever you're renaming multiple files to similar names</li>
      </ul>
    </>
  );

  const formatTip = (
    <>
      <p className="mb-2"><strong>Number Format Tips:</strong></p>
      <ul className="list-disc pl-4 space-y-1">
        <li><strong>Single:</strong> No padding (1, 2, 3...)</li>
        <li><strong>Double:</strong> 2-digit padding (01, 02, 03...)</li>
        <li><strong>Triple:</strong> 3-digit padding (001, 002, 003...)</li>
        <li><strong>Custom:</strong> Choose your own padding length</li>
      </ul>
    </>
  );

  const positionTip = (
    <>
      <p className="mb-2"><strong>Position Tips:</strong></p>
      <ul className="list-disc pl-4 space-y-1">
        <li><strong>Prefix:</strong> Add before filename (01_filename)</li>
        <li><strong>Suffix:</strong> Add after filename (filename_01)</li>
        <li><strong>Custom:</strong> Insert at a specific character position</li>
        <li>With snake_case or kebab-case, separators are automatically added</li>
      </ul>
    </>
  );

  // Format a preview number based on current settings
  const formatPreviewNumber = (num: number): string => {
    let result = num.toString();
    
    switch (format) {
      case 'double':
        result = result.padStart(2, '0');
        break;
      case 'triple':
        result = result.padStart(3, '0');
        break;
      case 'custom':
        if (customPadding && customPadding > 0) {
          result = result.padStart(customPadding, '0');
        }
        break;
    }
    
    return result;
  };

  // Show example with the number applied based on position
  const getExample = (): string => {
    const fileName = 'example';
    const num = formatPreviewNumber(start);
    
    switch (position) {
      case 'prefix':
        return `${num}${fileName}.txt`;
      case 'suffix':
        return `${fileName}${num}.txt`;
      case 'custom':
        if (customPosition !== undefined && customPosition <= fileName.length) {
          return `${fileName.substring(0, customPosition)}${num}${fileName.substring(customPosition)}.txt`;
        }
        return `${fileName}${num}.txt`;
      default:
        return `${fileName}${num}.txt`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Numbering</h3>
          <InfoTip content={numberingTip} />
        </div>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={enabled}
              onChange={handleToggle}
            />
            <div className={`block w-10 h-6 rounded-full ${enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${enabled ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      <div className={`${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center">
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number Format
              </label>
              <InfoTip content={formatTip} />
            </div>
            <select
              id="format"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={format}
              onChange={handleFormatChange}
              disabled={!enabled}
            >
              <option value="single">Single (1, 2, 3...)</option>
              <option value="double">Double (01, 02, 03...)</option>
              <option value="triple">Triple (001, 002, 003...)</option>
              <option value="custom">Custom padding</option>
            </select>
          </div>
          
          <div>
            <div className="flex items-center">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <InfoTip content={positionTip} />
            </div>
            <select
              id="position"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={position}
              onChange={handlePositionChange}
              disabled={!enabled}
            >
              <option value="prefix">Prefix</option>
              <option value="suffix">Suffix</option>
              <option value="custom">Custom position</option>
            </select>
          </div>
        </div>
        
        {showCustomPadding && (
          <div className="mb-4">
            <label htmlFor="customPadding" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Padding (number of digits)
            </label>
            <input
              id="customPadding"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={customPadding}
              onChange={handleCustomPaddingChange}
              disabled={!enabled || format !== 'custom'}
              min="1"
              max="10"
            />
          </div>
        )}
        
        {showCustomPosition && (
          <div className="mb-4">
            <label htmlFor="customPosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custom Position (character index)
            </label>
            <input
              id="customPosition"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={customPosition}
              onChange={handleCustomPositionChange}
              disabled={!enabled || position !== 'custom'}
              min="0"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start from
            </label>
            <input
              id="start"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={start}
              onChange={handleStartChange}
              disabled={!enabled}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="increment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Increment by
            </label>
            <input
              id="increment"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={increment}
              onChange={handleIncrementChange}
              disabled={!enabled}
              min="1"
            />
          </div>
        </div>

        <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example:</h5>
          
          <div className="font-mono text-sm">
            <p className="text-gray-600 dark:text-gray-400">Original: <span className="text-gray-800 dark:text-gray-200">example.txt</span></p>
            <p className="text-gray-600 dark:text-gray-400">Result: <span className="text-green-600 dark:text-green-400">{getExample()}</span></p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Sequence: <span className="text-green-600 dark:text-green-400">{formatPreviewNumber(start)}, {formatPreviewNumber(start + increment)}, {formatPreviewNumber(start + (increment * 2))}, ...</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberingRule; 