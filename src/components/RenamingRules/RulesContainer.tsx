import React, { useState } from 'react';
import TextOperationsRule from './TextOperationsRule';
import CaseTransformationRule from './CaseTransformationRule';
import NumberingRule from './NumberingRule';
import AdvancedRule from './AdvancedRule';
import PresetManager from '../Presets/PresetManager';

type TabType = 'basic' | 'advanced' | 'presets';

const RulesContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            className={`py-3 px-4 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Rules
          </button>
          <button
            className={`py-3 px-4 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === 'advanced'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced Rules
          </button>
          <button
            className={`py-3 px-4 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === 'presets'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('presets')}
          >
            Presets
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            {/* TextOperationsRule first as requested */}
            <TextOperationsRule />
            <CaseTransformationRule />
            <NumberingRule />
          </div>
        )}
        
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <AdvancedRule />
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-4">
            <PresetManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default RulesContainer; 