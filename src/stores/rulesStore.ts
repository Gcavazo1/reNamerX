import { create } from 'zustand';

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
      values?: Record<string, string>;
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

export const useRulesStore = create<IRulesStore>((set) => ({
  rules: { ...DEFAULT_RULES },
  presets: [],
  activePresetId: null,
  
  updateCaseTransformation: (enabled, type) => 
    set((state) => ({
      rules: {
        ...state.rules,
        caseTransformation: {
          ...state.rules.caseTransformation,
          enabled,
          ...(type ? { type } : {}),
        },
      },
    })),
  
  updateNumbering: (enabled, options) => 
    set((state) => ({
      rules: {
        ...state.rules,
        numbering: {
          ...state.rules.numbering,
          enabled,
          ...(options || {}),
        },
      },
    })),
  
  updateTextOperation: (operationType, enabled, options) => 
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
    })),
  
  updateAdvancedOption: (optionType, enabled, options) => 
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
    })),
  
  savePreset: (name) => 
    set((state) => {
      const newPreset: IPreset = {
        id: crypto.randomUUID(),
        name,
        rules: { ...state.rules },
      };
      return {
        presets: [...state.presets, newPreset],
        activePresetId: newPreset.id,
      };
    }),
  
  loadPreset: (presetId) => 
    set((state) => {
      const preset = state.presets.find(p => p.id === presetId);
      if (!preset) return state;
      return {
        rules: { ...preset.rules },
        activePresetId: presetId,
      };
    }),
  
  deletePreset: (presetId) => 
    set((state) => ({
      presets: state.presets.filter(p => p.id !== presetId),
      activePresetId: state.activePresetId === presetId ? null : state.activePresetId,
    })),
  
  updatePresetName: (presetId, name) => 
    set((state) => ({
      presets: state.presets.map(p => 
        p.id === presetId ? { ...p, name } : p
      ),
    })),
  
  resetRules: () => 
    set({
      rules: { ...DEFAULT_RULES },
      activePresetId: null,
    }),
})); 