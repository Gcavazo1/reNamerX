import { create } from 'zustand';
import { useHistoryStore } from './historyStore';

export type CaseType = 'pascalCase' | 'camelCase' | 'snakeCase' | 'kebabCase' | 'upperCase' | 'lowerCase';
export type NumberFormat = 'single' | 'double' | 'triple' | 'custom';
export type NumberPosition = 'prefix' | 'suffix' | 'custom';

export interface IPreset {
  id: string;
  name: string;
  rules: IRules;
}

export interface IRules {
  // Case transformation
  caseTransformation: {
    enabled: boolean;
    type: CaseType;
  };

  // Numbering options
  numbering: {
    enabled: boolean;
    format: NumberFormat;
    customPadding?: number;
    position: NumberPosition;
    start: number;
    increment: number;
    customPosition?: number;
  };

  // Text operations
  textOperations: {
    findReplace: {
      enabled: boolean;
      find: string;
      replace: string;
      useRegex: boolean;
      caseSensitive: boolean;
      replaceEntire: boolean;
    };
    prefix: {
      enabled: boolean;
      text: string;
    };
    suffix: {
      enabled: boolean;
      text: string;
    };
    removeChars: {
      enabled: boolean;
      fromStart: number;
      fromEnd: number;
    };
  };

  // Advanced options
  advanced: {
    dateStamp: {
      enabled: boolean;
      format: string;
      position: 'prefix' | 'suffix' | 'custom';
      customPosition?: number;
    };
    metadata: {
      enabled: boolean;
      useExif: boolean;
      useID3: boolean;
      pattern: string;
    };
  };
}

export interface IRulesStore {
  rules: IRules;
  presets: IPreset[];
  activePresetId: string | null;
  
  updateCaseTransformation: (enabled: boolean, type?: CaseType) => void;
  updateNumbering: (enabled: boolean, options?: Partial<IRules['numbering']>) => void;
  updateTextOperation: <K extends keyof IRules['textOperations']>(
    operationType: K,
    enabled: boolean,
    options?: Partial<IRules['textOperations'][K]>
  ) => void;
  updateAdvancedOption: <K extends keyof IRules['advanced']>(
    optionType: K,
    enabled: boolean,
    options?: Partial<IRules['advanced'][K]>
  ) => void;
  
  savePreset: (name: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  updatePresetName: (presetId: string, name: string) => void;
  
  resetRules: () => void;
  
  // Undo/Redo specific methods
  setRules: (rules: IRules) => void;
  undoRuleChange: (oldRules: IRules) => void;
  
  // Settings initialization
  initializeFromSettings: () => void;
}

// Default rules configuration
const DEFAULT_RULES: IRules = {
  caseTransformation: {
    enabled: false,
    type: 'camelCase',
  },
  numbering: {
    enabled: false,
    format: 'double',
    customPadding: 2,
    position: 'suffix',
    start: 1,
    increment: 1,
    customPosition: 0,
  },
  textOperations: {
    findReplace: {
      enabled: false,
      find: '',
      replace: '',
      useRegex: false,
      caseSensitive: false,
      replaceEntire: false,
    },
    prefix: {
      enabled: false,
      text: '',
    },
    suffix: {
      enabled: false,
      text: '',
    },
    removeChars: {
      enabled: false,
      fromStart: 0,
      fromEnd: 0,
    },
  },
  advanced: {
    dateStamp: {
      enabled: false,
      format: 'YYYY-MM-DD',
      position: 'prefix',
    },
    metadata: {
      enabled: false,
      useExif: false,
      useID3: false,
      pattern: '',
    },
  },
};

export const useRulesStore = create<IRulesStore>((set, get) => ({
  rules: { ...DEFAULT_RULES },
  presets: [],
  activePresetId: null,
  
  updateCaseTransformation: (enabled, type) => {
    const previousRules = { ...get().rules };
    
    set((state) => ({
      rules: {
        ...state.rules,
        caseTransformation: {
          ...state.rules.caseTransformation,
          enabled,
          ...(type ? { type } : {}),
        },
      },
    }));
    
    // Generate a descriptive message
    let description = enabled 
      ? `Changed case transformation to ${type || get().rules.caseTransformation.type}`
      : `Turned off case transformation`;
    
    // Remove reference to old history system
  },
  
  updateNumbering: (enabled, options) => {
    const previousRules = { ...get().rules };
    
    set((state) => ({
      rules: {
        ...state.rules,
        numbering: {
          ...state.rules.numbering,
          enabled,
          ...(options || {}),
        },
      },
    }));
    
    // Generate a descriptive message
    let description = "";
    if (!enabled) {
      description = "Disabled numbering";
    } else if (options) {
      if (options.start !== undefined) {
        description = `Set numbering to start at ${options.start}`;
      } else if (options.increment !== undefined) {
        description = `Set numbering increment to ${options.increment}`;
      } else if (options.format !== undefined) {
        description = `Changed numbering format to ${options.format}`;
      } else if (options.position !== undefined) {
        description = `Changed numbering position to ${options.position}`;
      } else {
        description = "Updated numbering settings";
      }
    } else {
      description = "Enabled numbering";
    }
    
    // Remove reference to old history system
  },
  
  updateTextOperation: (operationType, enabled, options) => {
    const previousRules = { ...get().rules };
    
    set((state) => ({
      rules: {
        ...state.rules,
        textOperations: {
          ...state.rules.textOperations,
          [operationType]: {
            ...state.rules.textOperations[operationType],
            enabled,
            ...(options || {}),
          },
        },
      },
    }));
    
    // Generate a descriptive message
    let description = "";
    if (!enabled) {
      description = `Disabled ${operationType} operation`;
    } else if (options) {
      if (operationType === 'findReplace') {
        if (options.find !== undefined) {
          description = `Updated find pattern for find & replace`;
        } else if (options.replace !== undefined) {
          description = `Updated replace text for find & replace`;
        } else {
          description = `Updated find & replace settings`;
        }
      } else if (operationType === 'prefix') {
        description = `Updated prefix text`;
      } else if (operationType === 'suffix') {
        description = `Updated suffix text`;
      } else if (operationType === 'removeChars') {
        description = `Updated character removal settings`;
      }
    } else {
      description = `Enabled ${operationType} operation`;
    }
    
    // Remove reference to old history system
  },
  
  updateAdvancedOption: (optionType, enabled, options) => {
    const previousRules = { ...get().rules };
    
    set((state) => ({
      rules: {
        ...state.rules,
        advanced: {
          ...state.rules.advanced,
          [optionType]: {
            ...state.rules.advanced[optionType],
            enabled,
            ...(options || {}),
          },
        },
      },
    }));
    
    // Generate a descriptive message
    let description = "";
    if (!enabled) {
      description = `Disabled advanced ${optionType} option`;
    } else if (options) {
      if (optionType === 'dateStamp') {
        description = `Updated date stamp settings`;
      } else if (optionType === 'metadata') {
        description = `Updated metadata settings`;
      }
    } else {
      description = `Enabled advanced ${optionType} option`;
    }
    
    // Remove reference to old history system
  },
  
  savePreset: (name) => 
    set((state) => {
      const newPreset: IPreset = {
        id: crypto.randomUUID(),
        name,
        rules: { ...state.rules },
      };
      const newPresets = [...state.presets, newPreset];
      
      // Save to localStorage
      try {
        localStorage.setItem('renamer_presets', JSON.stringify(newPresets));
        localStorage.setItem('renamer_active_preset', newPreset.id);
      } catch (error) {
        console.error('Error saving preset:', error);
      }
      
      return {
        presets: newPresets,
        activePresetId: newPreset.id,
      };
    }),
  
  loadPreset: (presetId) => 
    set((state) => {
      const preset = state.presets.find(p => p.id === presetId);
      if (!preset) return state;
      
      // Save active preset to localStorage
      try {
        localStorage.setItem('renamer_active_preset', presetId);
      } catch (error) {
        console.error('Error saving active preset:', error);
      }
      
      return {
        rules: { ...preset.rules },
        activePresetId: presetId,
      };
    }),
  
  deletePreset: (presetId) => 
    set((state) => {
      const newPresets = state.presets.filter(p => p.id !== presetId);
      const newActivePresetId = state.activePresetId === presetId ? null : state.activePresetId;
      
      // Save to localStorage
      try {
        localStorage.setItem('renamer_presets', JSON.stringify(newPresets));
        if (newActivePresetId) {
          localStorage.setItem('renamer_active_preset', newActivePresetId);
        } else {
          localStorage.removeItem('renamer_active_preset');
        }
      } catch (error) {
        console.error('Error saving presets after deletion:', error);
      }
      
      return {
        presets: newPresets,
        activePresetId: newActivePresetId,
      };
    }),
  
  updatePresetName: (presetId, name) => 
    set((state) => {
      const newPresets = state.presets.map(p => 
        p.id === presetId ? { ...p, name } : p
      );
      
      // Save to localStorage
      try {
        localStorage.setItem('renamer_presets', JSON.stringify(newPresets));
      } catch (error) {
        console.error('Error saving preset name update:', error);
      }
      
      return {
        presets: newPresets,
      };
    }),
    
  // Settings initialization
  initializeFromSettings: () => {
    try {
      // Load saved presets from localStorage
      const savedPresets = localStorage.getItem('renamer_presets');
      if (savedPresets) {
        const parsedPresets = JSON.parse(savedPresets);
        set({ presets: parsedPresets });
        
        // If there was an active preset, load it
        const activePresetId = localStorage.getItem('renamer_active_preset');
        if (activePresetId) {
          const preset = parsedPresets.find((p: IPreset) => p.id === activePresetId);
          if (preset) {
            set({ 
              rules: { ...preset.rules },
              activePresetId: preset.id 
            });
          }
        }
      }
    } catch (error) {
      console.error('Error initializing rules from settings:', error);
    }
  },
  
  resetRules: () => 
    set({
      rules: { ...DEFAULT_RULES },
      activePresetId: null,
    }),
    
  // Undo/Redo specific methods
  setRules: (rules) => 
    set({
      rules: { ...rules }
    }),
    
  undoRuleChange: (oldRules) =>
    set({
      rules: { ...oldRules }
    }),
})); 