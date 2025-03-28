import React, { useState, useEffect } from 'react';
import { useRulesStore, IPreset } from '../../stores/rulesStore';

const PresetManager: React.FC = () => {
  const { presets, activePresetId, savePreset, loadPreset, deletePreset, updatePresetName, resetRules } = useRulesStore();
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>('');

  // Expose save preset function to window object for keyboard shortcuts
  useEffect(() => {
    (window as any).__savePreset = (name: string) => {
      if (name && name.trim()) {
        savePreset(name.trim());
        return true;
      }
      return false;
    };
    
    return () => {
      delete (window as any).__savePreset;
    };
  }, [savePreset]);

  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      savePreset(newPresetName.trim());
      setNewPresetName('');
    }
  };

  const handleLoadPreset = (presetId: string) => {
    loadPreset(presetId);
  };

  const handleDeletePreset = (presetId: string) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      deletePreset(presetId);
    }
  };

  const handleEditPreset = (preset: IPreset) => {
    setEditMode(preset.id);
    setEditedName(preset.name);
  };

  const handleSaveEdit = (presetId: string) => {
    if (editedName.trim()) {
      updatePresetName(presetId, editedName.trim());
      setEditMode(null);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleResetRules = () => {
    if (window.confirm('Are you sure you want to reset all rules to default values?')) {
      resetRules();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium mb-4">Presets</h3>

      {/* Create new preset */}
      <div className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="New preset name"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSavePreset}
            disabled={!newPresetName.trim()}
          >
            Save Current Rules
          </button>
        </div>
      </div>

      {/* Reset rules button */}
      <div className="mb-4">
        <button
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={handleResetRules}
        >
          Reset to Default Rules
        </button>
      </div>

      {/* Divider */}
      {presets.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
      )}

      {/* Preset list */}
      {presets.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-md font-medium mb-2">Saved Presets</h4>
          <ul className="space-y-2">
            {presets.map((preset) => (
              <li 
                key={preset.id} 
                className={`flex items-center justify-between p-3 rounded-md ${
                  activePresetId === preset.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {editMode === preset.id ? (
                  <div className="flex-1 flex space-x-2">
                    <input 
                      type="text" 
                      className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      autoFocus
                    />
                    <button 
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      onClick={() => handleSaveEdit(preset.id)}
                      title="Save"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      onClick={handleCancelEdit}
                      title="Cancel"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{preset.name}</span>
                    <div className="flex space-x-1">
                      <button 
                        className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ${activePresetId === preset.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleLoadPreset(preset.id)}
                        disabled={activePresetId === preset.id}
                        title="Load preset"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                        onClick={() => handleEditPreset(preset)}
                        title="Edit name"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        onClick={() => handleDeletePreset(preset.id)}
                        title="Delete preset"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          No presets saved yet. Create your first preset by setting up rules and saving them.
        </div>
      )}
    </div>
  );
};

export default PresetManager; 