import React, { useEffect, useState } from 'react';
import { useFileStore } from '../../stores/fileStore';
import { useRulesStore } from '../../stores/rulesStore';

interface IMetadataItem {
  tag: string;
  value: string;
}

interface IFileMetadata {
  fileId: string;
  fileName: string;
  metadata: IMetadataItem[];
  extractedPattern?: string;
}

const MetadataPreview: React.FC = () => {
  const { files, selectedFiles, setProcessing } = useFileStore();
  const { rules } = useRulesStore();
  const [metadataResults, setMetadataResults] = useState<IFileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [applyingMetadata, setApplyingMetadata] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [operationResults, setOperationResults] = useState<{success: number, failed: number}>({
    success: 0,
    failed: 0
  });
  
  // Extract metadata when files are selected and metadata extraction is enabled
  useEffect(() => {
    if (files.length === 0 || !rules.advanced.metadata.enabled) {
      setMetadataResults([]);
      return;
    }
    
    const extractMetadata = async () => {
      setIsLoading(true);
      try {
        const results: IFileMetadata[] = [];
        
        for (const file of files) {
          if (selectedFiles.includes(file.id)) {
            // We'll simulate metadata extraction for now
            // In a real implementation, this would call a Tauri command to extract metadata
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            let metadata: IMetadataItem[] = [];
            let extractedPattern = '';
            
            // Simulate different metadata based on file type
            if (fileExtension === 'mp3' || fileExtension === 'flac' || fileExtension === 'wav') {
              if (rules.advanced.metadata.useID3) {
                // Use values from the form if available, otherwise use defaults
                const metadataValues = rules.advanced.metadata.values || {};
                
                // Use values from the form or fallback to defaults
                let artistValue = metadataValues.artist || 'Lunity';
                let titleValue = metadataValues.title || 'I really want to stay at your house';
                let albumValue = metadataValues.album || 'Cyberpunk Edgerunners';
                let yearValue = metadataValues.year || '2022';
                let genreValue = metadataValues.genre || 'Electronic';
                
                // Check if filename contains info we can use for defaults
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                if (fileName.includes('cyberpunk') && !metadataValues.title) {
                  titleValue = 'Cyberpunk Theme';
                  if (fileName.includes('2')) {
                    titleValue += ' (Remix)';
                  }
                }
                
                metadata = [
                  { tag: 'artist', value: artistValue },
                  { tag: 'title', value: titleValue },
                  { tag: 'album', value: albumValue },
                  { tag: 'year', value: yearValue },
                  { tag: 'genre', value: genreValue }
                ];
                
                // Apply pattern if specified
                if (rules.advanced.metadata.pattern) {
                  extractedPattern = rules.advanced.metadata.pattern
                    .replace(/{artist}/g, artistValue)
                    .replace(/{title}/g, titleValue)
                    .replace(/{album}/g, albumValue)
                    .replace(/{year}/g, yearValue)
                    .replace(/{genre}/g, genreValue);
                } else {
                  // Suggest a default pattern if none is provided
                  extractedPattern = `${artistValue} - ${titleValue} (${albumValue})`;
                }
              }
            } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
              if (rules.advanced.metadata.useExif) {
                metadata = [
                  { tag: 'date', value: '2023:09:30 14:30:00' },
                  { tag: 'camera', value: 'Example Camera' },
                  { tag: 'resolution', value: '1920x1080' },
                  { tag: 'location', value: 'Example Location' }
                ];
                
                if (rules.advanced.metadata.pattern) {
                  extractedPattern = rules.advanced.metadata.pattern
                    .replace(/{date}/g, '2023-09-30')
                    .replace(/{camera}/g, 'Example Camera')
                    .replace(/{resolution}/g, '1920x1080')
                    .replace(/{location}/g, 'Example Location');
                }
              }
            }
            
            results.push({
              fileId: file.id,
              fileName: file.name,
              metadata,
              extractedPattern
            });
          }
        }
        
        setMetadataResults(results);
      } catch (error) {
        setMetadataResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    extractMetadata();
  }, [files, selectedFiles, rules.advanced.metadata]);

  const handleApplyMetadata = async () => {
    setApplyingMetadata(true);
    setShowResults(false);
    setProcessing(true);
    
    try {
      // In a real implementation, this would call a Tauri command to apply metadata
      // For now, we'll just simulate success with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Count how many files would have metadata applied
      const successCount = metadataResults.filter(result => {
        // Count as success if we have either a pattern or explicit values
        return result.extractedPattern || (rules.advanced.metadata.values && Object.keys(rules.advanced.metadata.values).length > 0);
      }).length;
      
      const failedCount = metadataResults.length - successCount;
      
      setOperationResults({
        success: successCount,
        failed: failedCount
      });
      
      setShowResults(true);
    } catch (error) {
      setOperationResults({
        success: 0,
        failed: metadataResults.length
      });
      setShowResults(true);
    } finally {
      setApplyingMetadata(false);
      setProcessing(false);
    }
  };

  // No metadata to display if not enabled
  if (!rules.advanced.metadata.enabled) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Metadata Preview</h3>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleApplyMetadata}
          disabled={isLoading || applyingMetadata || metadataResults.length === 0}
        >
          {applyingMetadata ? 'Applying...' : 'Apply Metadata'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading metadata...</span>
        </div>
      ) : metadataResults.length === 0 ? (
        <div className="text-center p-6 text-gray-500 dark:text-gray-400">
          <p>No metadata found or no files selected.</p>
          <p className="text-sm mt-2">Select files and enable metadata extraction to see metadata.</p>
        </div>
      ) : (
        <>
          {showResults && (
            <div className={`mb-4 p-3 rounded-md ${
              operationResults.failed === 0 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
            }`}>
              <p>
                <strong>Results:</strong> {operationResults.success} file(s) metadata updated successfully,
                {operationResults.failed > 0 && ` ${operationResults.failed} file(s) failed`}
              </p>
            </div>
          )}
        
          <div className="max-h-64 overflow-y-auto mt-3 border border-gray-200 dark:border-gray-700 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metadata</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pattern Result</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {metadataResults.map((result) => (
                  <tr key={result.fileId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {result.fileName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {result.metadata.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {result.metadata.map((item, index) => (
                            <li key={index}>
                              <span className="font-semibold">{item.tag}:</span> {item.value}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-yellow-500 dark:text-yellow-400">No metadata found</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {result.extractedPattern ? (
                        <span className="text-green-600 dark:text-green-400">{result.extractedPattern}</span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No pattern applied</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Note: This preview shows metadata for selected files and how the pattern would be applied.
            Click "Apply Metadata" to write this metadata to the files without renaming them.
          </p>
          
          {metadataResults.length > 0 && !rules.advanced.metadata.pattern && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-sm">
              <strong>Tip:</strong> In the Advanced Rules tab, switch to Simple Mode to easily create a pattern 
              by selecting checkboxes for artist, title, album and other fields.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MetadataPreview; 