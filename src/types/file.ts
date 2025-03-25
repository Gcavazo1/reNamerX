export interface IFile {
  id: string;
  name: string;
  path: string;
  originalName: string;
  newName: string | null;
  isDirectory: boolean;
  size: number;
  lastModified: Date;
  type: string;
} 