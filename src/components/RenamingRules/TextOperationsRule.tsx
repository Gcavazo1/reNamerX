import React from 'react';
import { useRulesStore } from '../../stores/rulesStore';
import { InfoTip } from '../common';

const TextOperationsRule: React.FC = () => {
  const { rules, updateTextOperation } = useRulesStore();
  const { findReplace, prefix, suffix, removeChars } = rules.textOperations;

  // Find & Replace handlers
  const handleFindReplaceToggle = () => {
    updateTextOperation('findReplace', !findReplace.enabled);
  };

  const handleFindChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextOperation('findReplace', findReplace.enabled, { find: e.target.value });
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextOperation('findReplace', findReplace.enabled, { replace: e.target.value });
  };

  const handleRegexToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextOperation('findReplace', findReplace.enabled, { useRegex: e.target.checked });
  };

  const handleCaseSensitiveToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextOperation('findReplace', findReplace.enabled, { caseSensitive: e.target.checked });
  };

  const handleReplaceEntireToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextOperation('findReplace', findReplace.enabled, { replaceEntire: e.target.checked });
  };

  // Prefix handlers
  const handlePrefixToggle = () => {
    updateTextOperation('prefix', !prefix.enabled);
  };

  const handlePrefixTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextOperation('prefix', prefix.enabled, { text: e.target.value });
  };

  // Suffix handlers
  const handleSuffixToggle = () => {
    updateTextOperation('suffix', !suffix.enabled);
  };

  const handleSuffixTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextOperation('suffix', suffix.enabled, { text: e.target.value });
  };

  // Remove characters handlers
  const handleRemoveCharsToggle = () => {
    updateTextOperation('removeChars', !removeChars.enabled);
  };

  const handleFromStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      updateTextOperation('removeChars', removeChars.enabled, { fromStart: value });
    }
  };

  const handleFromEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      updateTextOperation('removeChars', removeChars.enabled, { fromEnd: value });
    }
  };

  // Tooltip contents
  const findReplaceTip = (
    <>
      <p className="mb-2"><strong>Find & Replace Tips:</strong></p>
      <ul className="list-disc pl-4 space-y-1">
        <li>Use this to add spaces to filenames that are concatenated</li>
        <li>Example: Find "testfile" replace with "test file "</li>
        <li>Check "Replace Entire Filename" to set a common base name for all files</li>
        <li><strong>Warning:</strong> When replacing entire filenames, enable Numbering to prevent duplicates</li>
        <li><strong>Useful RegEx patterns:</strong></li>
        <li><code>([a-z])([A-Z])</code> → <code>$1 $2</code> (Adds spaces in camelCase)</li>
        <li><code>\d+</code> (Matches one or more digits)</li>
        <li><code>^\d+</code> (Matches numbers at the start)</li>
        <li><code>\d+$</code> (Matches numbers at the end)</li>
      </ul>
    </>
  );
  
  const prefixTip = (
    <>
      <p className="mb-2"><strong>Prefix Tips:</strong></p>
      <ul className="list-disc pl-4 space-y-1">
        <li>When case transformation is enabled, a space is automatically added after prefix</li>
        <li>For case formats like snake_case or kebab-case, this ensures proper word separation</li>
        <li>If you don't want this behavior, add a space manually at the end of your prefix</li>
      </ul>
    </>
  );
  
  const suffixTip = (
    <>
      <p className="mb-2"><strong>Suffix Tips:</strong></p>
      <ul className="list-disc pl-4 space-y-1">
        <li>When case transformation is enabled, a space is automatically added before suffix</li>
        <li>For case formats like snake_case or kebab-case, this ensures proper word separation</li>
        <li>If you don't want this behavior, add a space manually at the start of your suffix</li>
      </ul>
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium mb-4">Text Operations</h3>

      {/* Find & Replace */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h4 className="text-md font-medium">Find & Replace</h4>
            <InfoTip content={findReplaceTip} />
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={findReplace.enabled}
                onChange={handleFindReplaceToggle}
              />
              <div className={`block w-10 h-6 rounded-full ${findReplace.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${findReplace.enabled ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className={`${findReplace.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className={findReplace.replaceEntire ? 'opacity-50' : 'opacity-100'}>
              <label htmlFor="findText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Find:
              </label>
              <input
                id="findText"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={findReplace.find}
                onChange={handleFindChange}
                disabled={!findReplace.enabled || findReplace.replaceEntire}
                placeholder={findReplace.replaceEntire ? "Entire filename will be replaced" : "Text to find"}
              />
            </div>
            <div>
              <label htmlFor="replaceText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Replace{findReplace.replaceEntire ? " with" : ""}:
              </label>
              <input
                id="replaceText"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={findReplace.replace}
                onChange={handleReplaceChange}
                disabled={!findReplace.enabled}
                placeholder={findReplace.replaceEntire ? "New base name for all files" : "Replacement text"}
              />
            </div>
          </div>
          <div className="flex flex-wrap space-x-4">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                checked={findReplace.replaceEntire}
                onChange={handleReplaceEntireToggle}
                disabled={!findReplace.enabled}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Replace Entire Filename</span>
            </label>
            <label className={`flex items-center mb-2 ${findReplace.replaceEntire ? 'opacity-50' : 'opacity-100'}`}>
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                checked={findReplace.useRegex}
                onChange={handleRegexToggle}
                disabled={!findReplace.enabled || findReplace.replaceEntire}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Use RegEx</span>
            </label>
            <label className={`flex items-center mb-2 ${findReplace.replaceEntire ? 'opacity-50' : 'opacity-100'}`}>
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                checked={findReplace.caseSensitive}
                onChange={handleCaseSensitiveToggle}
                disabled={!findReplace.enabled || findReplace.replaceEntire}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Case Sensitive</span>
            </label>
          </div>

          {findReplace.replaceEntire && (
            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded text-sm">
              <strong>Tip:</strong> Consider enabling Numbering to ensure each file has a unique name.
            </div>
          )}
        </div>
      </div>

      {/* Prefix */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h4 className="text-md font-medium">Add Prefix</h4>
            <InfoTip content={prefixTip} />
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={prefix.enabled}
                onChange={handlePrefixToggle}
              />
              <div className={`block w-10 h-6 rounded-full ${prefix.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${prefix.enabled ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className={`${prefix.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="mb-3">
            <label htmlFor="prefixText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prefix Text:
            </label>
            <input
              id="prefixText"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={prefix.text}
              onChange={handlePrefixTextChange}
              disabled={!prefix.enabled}
              placeholder="Text to add at the beginning"
            />
          </div>
        </div>
      </div>

      {/* Suffix */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h4 className="text-md font-medium">Add Suffix</h4>
            <InfoTip content={suffixTip} />
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={suffix.enabled}
                onChange={handleSuffixToggle}
              />
              <div className={`block w-10 h-6 rounded-full ${suffix.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${suffix.enabled ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className={`${suffix.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="mb-3">
            <label htmlFor="suffixText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Suffix Text:
            </label>
            <input
              id="suffixText"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={suffix.text}
              onChange={handleSuffixTextChange}
              disabled={!suffix.enabled}
              placeholder="Text to add at the end"
            />
          </div>
        </div>
      </div>

      {/* Remove Characters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium">Remove Characters</h4>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={removeChars.enabled}
                onChange={handleRemoveCharsToggle}
              />
              <div className={`block w-10 h-6 rounded-full ${removeChars.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${removeChars.enabled ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className={`${removeChars.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="removeFromStart" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Start:
              </label>
              <input
                id="removeFromStart"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={removeChars.fromStart}
                onChange={handleFromStartChange}
                disabled={!removeChars.enabled}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="removeFromEnd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From End:
              </label>
              <input
                id="removeFromEnd"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={removeChars.fromEnd}
                onChange={handleFromEndChange}
                disabled={!removeChars.enabled}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextOperationsRule; 