import React, { useEffect } from 'react';
import { useRulesStore, CaseType } from '../../stores/rulesStore';
import { InfoTip } from '../common';

const CaseTransformationRule: React.FC = () => {
  const { rules, updateCaseTransformation } = useRulesStore();
  const { enabled, type } = rules.caseTransformation;

  const handleToggle = () => {
    updateCaseTransformation({ enabled: !enabled });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as CaseType;
    updateCaseTransformation({ type: newType });
  };

  const caseTipContent = (
    <>
      <p className="mb-2"><strong>Case Transformation Tips:</strong></p>
      <ul className="list-disc pl-4 space-y-1">
        <li>Case transformation works best when words are separated by spaces.</li>
        <li>For files like "testingfile.txt", you can use Find &amp; Replace to add spaces first.</li>
        <li>Prefix and suffix will automatically add spaces when used with case transformation.</li>
        <li>The app detects camelCase and PascalCase word boundaries automatically.</li>
      </ul>
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Case Transformation</h3>
          <InfoTip content={caseTipContent} />
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
        <div className="mb-3">
          <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Transform to:
          </label>
          <select
            id="caseType"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={type}
            onChange={handleTypeChange}
            disabled={!enabled}
          >
            <option value="camelCase">camelCase</option>
            <option value="pascalCase">PascalCase</option>
            <option value="snakeCase">snake_case</option>
            <option value="kebabCase">kebab-case</option>
            <option value="upperCase">UPPERCASE</option>
            <option value="lowerCase">lowercase</option>
          </select>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Example:</strong>
          </p>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-mono">
              <span className="text-gray-500 dark:text-gray-400">Original: </span>
              <span>My File Name.txt</span>
            </p>
            <p className="text-sm font-mono">
              <span className="text-gray-500 dark:text-gray-400">Result: </span>
              <span className="text-green-600 dark:text-green-400">
                {type === 'camelCase' && 'myFileName.txt'}
                {type === 'pascalCase' && 'MyFileName.txt'}
                {type === 'snakeCase' && 'my_file_name.txt'}
                {type === 'kebabCase' && 'my-file-name.txt'}
                {type === 'upperCase' && 'MYFILENAME.txt'}
                {type === 'lowerCase' && 'myfilename.txt'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseTransformationRule; 