import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IPreset } from './rulesStore';

// Define the types of settings we want to persist
export interface AppSettings {
  // UI preferences
  darkMode: boolean;
  sidebarCollapsed: boolean;
  
  // Recent locations
  recentDirectories: string[];
  
  // Presets (stored in rulesStore but persisted here)
  savedPresets: IPreset[];
  lastActivePresetId: string | null;
  
  // File filters
  lastActiveFileFilter: string;
  
  // Other settings
  confirmBeforeRename: boolean;
  maxRecentDirectories: number;
  autoSelectNewFiles: boolean;
}

// Define the settings store interface with actions
export interface SettingsStore extends AppSettings {
  // UI preference actions
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Recent locations actions
  addRecentDirectory: (path: string) => void;
  clearRecentDirectories: () => void;
  
  // Preset actions (synchronization with rulesStore)
  updateSavedPresets: (presets: IPreset[]) => void;
  setLastActivePresetId: (presetId: string | null) => void;
  
  // File filter actions
  setLastActiveFileFilter: (filter: string) => void;
  
  // Other setting actions
  setConfirmBeforeRename: (confirm: boolean) => void;
  setMaxRecentDirectories: (max: number) => void;
  setAutoSelectNewFiles: (autoSelect: boolean) => void;
  
  // Persistence
  saveSettings: () => void;
  
  // Reset all settings
  resetSettings: () => void;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  sidebarCollapsed: false,
  recentDirectories: [],
  savedPresets: [],
  lastActivePresetId: null,
  lastActiveFileFilter: 'All Files',
  confirmBeforeRename: true,
  maxRecentDirectories: 10,
  autoSelectNewFiles: true,
};

// Create the store with persistence
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      // UI preference actions
      setDarkMode: (darkMode) => set({ darkMode }),
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      
      // Recent locations actions
      addRecentDirectory: (path) => set(state => {
        const recentDirs = state.recentDirectories.filter(dir => dir !== path);
        return { 
          recentDirectories: [path, ...recentDirs].slice(0, state.maxRecentDirectories) 
        };
      }),
      clearRecentDirectories: () => set({ recentDirectories: [] }),
      
      // Preset actions
      updateSavedPresets: (presets) => set({ savedPresets: presets }),
      setLastActivePresetId: (presetId) => set({ lastActivePresetId: presetId }),
      
      // File filter actions
      setLastActiveFileFilter: (filter) => set({ lastActiveFileFilter: filter }),
      
      // Other setting actions
      setConfirmBeforeRename: (confirmBeforeRename) => set({ confirmBeforeRename }),
      setMaxRecentDirectories: (maxRecentDirectories) => set({ maxRecentDirectories }),
      setAutoSelectNewFiles: (autoSelectNewFiles) => set({ autoSelectNewFiles }),
      
      // Persistence
      saveSettings: () => set(state => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        recentDirectories: state.recentDirectories,
        savedPresets: state.savedPresets,
        lastActivePresetId: state.lastActivePresetId,
        lastActiveFileFilter: state.lastActiveFileFilter,
        confirmBeforeRename: state.confirmBeforeRename,
        maxRecentDirectories: state.maxRecentDirectories,
        autoSelectNewFiles: state.autoSelectNewFiles
      })),
      
      // Reset all settings
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'file-renamer-settings',
      // Only persist specific paths if needed
      // partialize: (state) => ({ darkMode: state.darkMode, ... })
    }
  )
); 