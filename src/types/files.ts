/**
 * Interface for file information returned by filesystem operations
 */
export interface FileInfo {
  id: string;
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  type?: string;
  dateModified?: number;
  dateCreated?: number;
  metadata?: {
    [key: string]: string | number | boolean | null;
  };
} 