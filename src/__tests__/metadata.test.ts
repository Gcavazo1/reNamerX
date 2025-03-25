import { extractMetadata, formatWithPattern } from '../utils/fileOperations/metadataExtractor';
import { IFile } from '../types/file';

// Mock the Tauri invoke function
const mockInvoke = jest.fn();
jest.mock('@tauri-apps/api', () => ({
  invoke: (...args: any[]) => mockInvoke(...args)
}));

describe('Metadata Extraction', () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  describe('extractMetadata', () => {
    const mockMp3File: IFile = {
      id: '1',
      name: 'test-song.mp3',
      originalName: 'test-song.mp3',
      path: '/path/to/test-song.mp3',
      type: 'mp3',
      size: 1024,
      isDirectory: false
    };

    const mockJpegFile: IFile = {
      id: '2',
      name: 'test-image.jpg',
      originalName: 'test-image.jpg',
      path: '/path/to/test-image.jpg',
      type: 'jpg',
      size: 2048,
      isDirectory: false
    };

    test('should extract ID3 metadata from MP3 files', async () => {
      // Mock the response from the Rust backend
      mockInvoke.mockResolvedValueOnce({
        success: true,
        metadata: {
          'artist': 'Test Artist',
          'title': 'Test Title',
          'album': 'Test Album',
          'year': '2023',
          'genre': 'Test Genre'
        }
      });

      const result = await extractMetadata(mockMp3File, true, false);

      // Verify the invoke function was called correctly
      expect(mockInvoke).toHaveBeenCalledWith('extract_metadata', {
        path: mockMp3File.path,
        useExif: false,
        useID3: true
      });

      // Verify the returned metadata is correct
      expect(result.success).toBe(true);
      expect(result.metadata).toEqual({
        'artist': 'Test Artist',
        'title': 'Test Title',
        'album': 'Test Album',
        'year': '2023',
        'genre': 'Test Genre'
      });
    });

    test('should extract EXIF metadata from JPEG files', async () => {
      // Mock the response from the Rust backend
      mockInvoke.mockResolvedValueOnce({
        success: true,
        metadata: {
          'camera': 'Test Camera',
          'resolution': '1920x1080',
          'date': '2023-01-01',
          'location': 'Test Location'
        }
      });

      const result = await extractMetadata(mockJpegFile, false, true);

      // Verify the invoke function was called correctly
      expect(mockInvoke).toHaveBeenCalledWith('extract_metadata', {
        path: mockJpegFile.path,
        useExif: true,
        useID3: false
      });

      // Verify the returned metadata is correct
      expect(result.success).toBe(true);
      expect(result.metadata).toEqual({
        'camera': 'Test Camera',
        'resolution': '1920x1080',
        'date': '2023-01-01',
        'location': 'Test Location'
      });
    });

    test('should handle extraction errors gracefully', async () => {
      // Mock an error response
      mockInvoke.mockResolvedValueOnce({
        success: false,
        error: 'Failed to extract metadata'
      });

      const result = await extractMetadata(mockMp3File, true, true);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to extract metadata');
    });
  });

  describe('formatWithPattern', () => {
    test('should replace metadata tags in pattern', () => {
      const metadata = {
        'artist': 'Test Artist',
        'title': 'Test Title',
        'album': 'Test Album',
        'year': '2023'
      };

      const pattern = '{artist} - {title} ({album}) [{year}]';
      const result = formatWithPattern(pattern, metadata);

      expect(result).toBe('Test Artist - Test Title (Test Album) [2023]');
    });

    test('should handle missing metadata tags', () => {
      const metadata = {
        'artist': 'Test Artist',
        'title': 'Test Title'
        // album and year are missing
      };

      const pattern = '{artist} - {title} ({album}) [{year}]';
      const result = formatWithPattern(pattern, metadata);

      // Missing tags should be replaced with empty strings
      expect(result).toBe('Test Artist - Test Title () []');
    });

    test('should return original pattern if no metadata is provided', () => {
      const pattern = '{artist} - {title}';
      const result = formatWithPattern(pattern, {});

      expect(result).toBe(' - ');
    });

    test('should return empty string if no pattern is provided', () => {
      const metadata = {
        'artist': 'Test Artist',
        'title': 'Test Title'
      };

      const result = formatWithPattern('', metadata);

      expect(result).toBe('');
    });
  });
}); 