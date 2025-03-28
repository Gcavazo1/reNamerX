import { create } from 'zustand';

// Predefined file type groups for convenience
export interface FileTypeGroup {
  name: string;
  extensions: string[];
  icon?: string;
}

export const FILE_TYPE_GROUPS: FileTypeGroup[] = [
  {
    name: 'All Files',
    extensions: [],
    icon: 'file'
  },
  {
    name: 'Images',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico', 'heic', 'avif'],
    icon: 'image'
  },
  {
    name: 'Videos',
    extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v', '3gp'],
    icon: 'video'
  },
  {
    name: 'Audio',
    extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma'],
    icon: 'audio'
  },
  {
    name: 'Documents',
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'csv'],
    icon: 'document'
  },
  {
    name: 'Archives',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'iso'],
    icon: 'archive'
  }
];

// Add specific image type groups
export const IMAGE_TYPE_GROUPS: FileTypeGroup[] = [
  {
    name: 'PNG Files',
    extensions: ['png'],
    icon: 'image'
  },
  {
    name: 'JPEG Files',
    extensions: ['jpg', 'jpeg'],
    icon: 'image'
  },
  {
    name: 'SVG Files',
    extensions: ['svg'],
    icon: 'image'
  },
  {
    name: 'GIF Files',
    extensions: ['gif'],
    icon: 'image'
  },
  {
    name: 'AVIF Files',
    extensions: ['avif'],
    icon: 'image'
  },
  {
    name: 'WebP Files',
    extensions: ['webp'],
    icon: 'image'
  },
  {
    name: 'Other Images',
    extensions: ['bmp', 'tiff', 'ico', 'heic'],
    icon: 'image'
  }
];

export interface FileFilterState {
  activeFilter: string;
  customExtensions: string[];
  setActiveFilter: (filter: string) => void;
  setCustomExtensions: (extensions: string[]) => void;
  getActiveExtensions: () => string[];
  isFileTypeMatched: (filename: string) => boolean;
  getAvailableFilters: () => FileTypeGroup[];
  resetFilter: () => void;
  filterFiles: (files: any[]) => any[];
}

export const useFileFilterStore = create<FileFilterState>((set, get) => ({
  activeFilter: 'All Files',
  customExtensions: [],
  
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  setCustomExtensions: (extensions) => set({ 
    customExtensions: extensions,
    activeFilter: 'custom'
  }),
  
  resetFilter: () => set({ activeFilter: 'All Files' }),
  
  getActiveExtensions: () => {
    const { activeFilter, customExtensions } = get();
    
    if (activeFilter === 'custom') {
      return customExtensions;
    }
    
    // Check image-specific groups first
    const imageGroup = IMAGE_TYPE_GROUPS.find(g => g.name === activeFilter);
    if (imageGroup) {
      return imageGroup.extensions;
    }
    
    // Check main groups
    const group = FILE_TYPE_GROUPS.find(g => g.name === activeFilter);
    return group ? group.extensions : [];
  },
  
  isFileTypeMatched: (filename: string) => {
    // Safety check for filename
    if (!filename) return false;
    
    // Special case for files without extensions
    if (!filename.includes('.')) {
      return get().activeFilter === 'All Files' || get().activeFilter === '';
    }
    
    // Extract extension
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    // No active filter means all files match
    if (!get().activeFilter || get().activeFilter === 'All Files') {
      return true;
    }
    
    // Get active extensions based on the current filter
    const activeExtensions = get().getActiveExtensions();
    
    // If we have extensions, check if the file's extension matches
    return activeExtensions.length === 0 || activeExtensions.includes(extension);
  },
  
  filterFiles: (files) => {
    // Safety check
    if (!Array.isArray(files)) {
      console.warn('filterFiles expected an array but got:', typeof files);
      return [];
    }
    
    // If no active filter, return all files
    if (!get().activeFilter || get().activeFilter === 'All Files') {
      return files;
    }
    
    // Otherwise, filter files based on their name
    return files.filter(file => get().isFileTypeMatched(file.name));
  },
  
  getAvailableFilters: () => {
    // Always show all filter groups including image-specific types
    return [...FILE_TYPE_GROUPS.filter(g => g.name !== 'Images'), ...IMAGE_TYPE_GROUPS];
  }
})); 