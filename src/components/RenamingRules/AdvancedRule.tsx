import React, { useState, useEffect } from 'react';
import { useRulesStore } from '../../stores/rulesStore';

const AdvancedRule: React.FC = () => {
  const { rules, updateAdvancedOption } = useRulesStore();
  const { dateStamp, metadata } = rules.advanced;

  const [showCustomPosition, setShowCustomPosition] = useState<boolean>(dateStamp.position === 'custom');
  const [metadataFormat, setMetadataFormat] = useState<'pattern' | 'fields'>('pattern');
  const [metadataFields, setMetadataFields] = useState({
    artist: true,
    title: true,
    album: true,
    year: false,
    genre: false,
    separator: ' - ',
    prefix: '',
    suffix: ''
  });
  
  // Add state for metadata values
  const [metadataValues, setMetadataValues] = useState({
    artist: '',
    title: '',
    album: '',
    year: '',
    genre: ''
  });

  // On mount, try to parse existing pattern into fields
  useEffect(() => {
    if (metadata.pattern) {
      // Try to detect if we're dealing with a pattern that can be represented by fields
      const hasArtist = metadata.pattern.includes('{artist}');
      const hasTitle = metadata.pattern.includes('{title}');
      const hasAlbum = metadata.pattern.includes('{album}');
      const hasYear = metadata.pattern.includes('{year}');
      const hasGenre = metadata.pattern.includes('{genre}');
      
      if (hasArtist || hasTitle || hasAlbum) {
        setMetadataFormat('fields');
        
        // Update fields based on what's in the pattern
        setMetadataFields(prev => ({
          ...prev,
          artist: hasArtist,
          title: hasTitle,
          album: hasAlbum,
          year: hasYear,
          genre: hasGenre
        }));

        // Try to extract separator
        if (hasArtist && hasTitle) {
          const artistIndex = metadata.pattern.indexOf('{artist}');
          const titleIndex = metadata.pattern.indexOf('{title}');
          
          if (artistIndex < titleIndex) {
            const separator = metadata.pattern.substring(
              artistIndex + '{artist}'.length, 
              titleIndex
            );
            if (separator) {
              setMetadataFields(prev => ({ ...prev, separator }));
            }
          }
        }
        
        // Try to extract values from actual file metadata if available
        // This would come from a Tauri API call in a real implementation
        // For now, set some example values
        setMetadataValues({
          artist: 'Lunity',
          title: 'I really want to stay at your house',
          album: 'Cyberpunk Edgerunners',
          year: '2022',
          genre: 'Electronic'
        });
      }
    }
  }, []);

  // Date stamp handlers
  const handleDateStampToggle = () => {
    updateAdvancedOption('dateStamp', !dateStamp.enabled);
  };

  const handleDateFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdvancedOption('dateStamp', dateStamp.enabled, { format: e.target.value });
  };

  const handleDatePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPosition = e.target.value as 'prefix' | 'suffix' | 'custom';
    setShowCustomPosition(newPosition === 'custom');
    updateAdvancedOption('dateStamp', dateStamp.enabled, { position: newPosition });
  };

  const handleCustomPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pos = parseInt(e.target.value);
    if (!isNaN(pos) && pos >= 0) {
      updateAdvancedOption('dateStamp', dateStamp.enabled, { customPosition: pos });
    }
  };

  // Metadata handlers
  const handleMetadataToggle = () => {
    updateAdvancedOption('metadata', !metadata.enabled);
  };

  const handleUseExifToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdvancedOption('metadata', metadata.enabled, { useExif: e.target.checked });
  };

  const handleUseID3Toggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdvancedOption('metadata', metadata.enabled, { useID3: e.target.checked });
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdvancedOption('metadata', metadata.enabled, { pattern: e.target.value });
  };

  const handleMetadataFormatChange = (format: 'pattern' | 'fields') => {
    setMetadataFormat(format);
    
    if (format === 'fields') {
      // Generate pattern from fields
      updateMetadataPatternFromFields();
    }
  };

  const handleMetadataFieldToggle = (field: string, value: boolean) => {
    setMetadataFields(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update the pattern based on the new fields
    updateMetadataPatternFromFields({
      ...metadataFields,
      [field]: value
    });
  };

  const handleMetadataSeparatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const separator = e.target.value;
    setMetadataFields(prev => ({
      ...prev,
      separator
    }));
    
    // Update the pattern based on the new separator
    updateMetadataPatternFromFields({
      ...metadataFields,
      separator
    });
  };

  const handleMetadataPreSuffixChange = (type: 'prefix' | 'suffix', value: string) => {
    setMetadataFields(prev => ({
      ...prev,
      [type]: value
    }));
    
    // Update the pattern based on the new prefix/suffix
    updateMetadataPatternFromFields({
      ...metadataFields,
      [type]: value
    });
  };

  const updateMetadataPatternFromFields = (fields = metadataFields) => {
    const { artist, title, album, year, genre, separator, prefix, suffix } = fields;
    
    let pattern = '';
    
    // Add prefix if present
    if (prefix) pattern += prefix;
    
    // Add fields with separators
    const enabledFields = [];
    if (artist) enabledFields.push('{artist}');
    if (title) enabledFields.push('{title}');
    if (album) enabledFields.push('{album}');
    if (year) enabledFields.push('{year}');
    if (genre) enabledFields.push('{genre}');
    
    pattern += enabledFields.join(separator);
    
    // Add suffix if present
    if (suffix) pattern += suffix;
    
    // Update the pattern if it's different
    if (pattern !== metadata.pattern) {
      updateAdvancedOption('metadata', metadata.enabled, { pattern });
    }
  };

  // Generate a formatted date example
  const getDateExample = (): string => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      return dateStamp.format
        .replace(/YYYY/g, year.toString())
        .replace(/MM/g, month)
        .replace(/DD/g, day)
        .replace(/HH/g, hours)
        .replace(/mm/g, minutes)
        .replace(/ss/g, seconds);
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  };

  // After handleMetadataSeparatorChange, update the handler for metadata values
  const handleMetadataValueChange = (field: string, value: string) => {
    setMetadataValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // This is where we would update the actual metadata through Tauri
    // For now, we're just updating the UI state
    
    // Add metadata values to a global store that the MetadataPreview can access
    updateAdvancedOption('metadata', metadata.enabled, { 
      values: {
        ...metadata.values || {},
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium mb-4">Advanced Options</h3>

      {/* Date Stamp */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium">Date Stamp</h4>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={dateStamp.enabled}
                onChange={handleDateStampToggle}
              />
              <div className={`block w-10 h-6 rounded-full ${dateStamp.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${dateStamp.enabled ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className={`${dateStamp.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="mb-3">
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Format:
            </label>
            <input
              id="dateFormat"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={dateStamp.format}
              onChange={handleDateFormatChange}
              disabled={!dateStamp.enabled}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Format: YYYY = year, MM = month, DD = day, HH = hour, mm = minute, ss = second
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Example: <span className="font-mono">{getDateExample()}</span>
            </p>
          </div>

          <div className="mb-3">
            <label htmlFor="datePosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position:
            </label>
            <select
              id="datePosition"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={dateStamp.position}
              onChange={handleDatePositionChange}
              disabled={!dateStamp.enabled}
            >
              <option value="prefix">Prefix</option>
              <option value="suffix">Suffix</option>
              <option value="custom">Custom position</option>
            </select>
          </div>

          {showCustomPosition && (
            <div className="mb-3">
              <label htmlFor="dateCustomPosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position (character index):
              </label>
              <input
                id="dateCustomPosition"
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={dateStamp.customPosition || 0}
                onChange={handleCustomPositionChange}
                disabled={!dateStamp.enabled}
              />
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium">Metadata-based Renaming</h4>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={metadata.enabled}
                onChange={handleMetadataToggle}
              />
              <div className={`block w-10 h-6 rounded-full ${metadata.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform ${metadata.enabled ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className={`${metadata.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex space-x-4 mb-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={metadata.useExif}
                onChange={handleUseExifToggle}
                disabled={!metadata.enabled}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Use EXIF (images)</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={metadata.useID3}
                onChange={handleUseID3Toggle}
                disabled={!metadata.enabled}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Use ID3 (music)</span>
            </label>
          </div>

          {/* Metadata Format Toggle */}
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-3 py-1 rounded text-sm ${
                  metadataFormat === 'fields' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleMetadataFormatChange('fields')}
              >
                Simple Mode (Fields)
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded text-sm ${
                  metadataFormat === 'pattern' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleMetadataFormatChange('pattern')}
              >
                Advanced Mode (Pattern)
              </button>
            </div>
          </div>

          {/* Metadata Pattern Editor */}
          {metadataFormat === 'pattern' ? (
            <div className="mb-3">
              <label htmlFor="metadataPattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pattern:
              </label>
              <input
                id="metadataPattern"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={metadata.pattern}
                onChange={handlePatternChange}
                disabled={!metadata.enabled}
                placeholder="{artist} - {title}"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use {'{tags}'} for metadata. For images: {'{date}'}, {'{camera}'}, {'{resolution}'}, etc.
                <br />
                For music: {'{artist}'}, {'{title}'}, {'{album}'}, {'{year}'}, {'{genre}'}, etc.
              </p>
            </div>
          ) : (
            /* Metadata Fields Editor */
            <div className="mb-3 space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Easy mode:</strong> Select the metadata fields you want to include and how they should be formatted.
                  <br />
                  Current pattern: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">{metadata.pattern || "No pattern set"}</code>
                </p>
              </div>
            
              {/* Metadata fields selection with input fields */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="flex items-center w-24">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={metadataFields.artist}
                      onChange={(e) => handleMetadataFieldToggle('artist', e.target.checked)}
                      disabled={!metadata.enabled}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Artist</span>
                  </label>
                  
                  {metadataFields.artist && (
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Artist name"
                      value={metadataValues.artist}
                      onChange={(e) => handleMetadataValueChange('artist', e.target.value)}
                      disabled={!metadata.enabled}
                    />
                  )}
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center w-24">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={metadataFields.title}
                      onChange={(e) => handleMetadataFieldToggle('title', e.target.checked)}
                      disabled={!metadata.enabled}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Title</span>
                  </label>
                  
                  {metadataFields.title && (
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Track title"
                      value={metadataValues.title}
                      onChange={(e) => handleMetadataValueChange('title', e.target.value)}
                      disabled={!metadata.enabled}
                    />
                  )}
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center w-24">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={metadataFields.album}
                      onChange={(e) => handleMetadataFieldToggle('album', e.target.checked)}
                      disabled={!metadata.enabled}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Album</span>
                  </label>
                  
                  {metadataFields.album && (
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Album name"
                      value={metadataValues.album}
                      onChange={(e) => handleMetadataValueChange('album', e.target.value)}
                      disabled={!metadata.enabled}
                    />
                  )}
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center w-24">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={metadataFields.year}
                      onChange={(e) => handleMetadataFieldToggle('year', e.target.checked)}
                      disabled={!metadata.enabled}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Year</span>
                  </label>
                  
                  {metadataFields.year && (
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Release year"
                      value={metadataValues.year}
                      onChange={(e) => handleMetadataValueChange('year', e.target.value)}
                      disabled={!metadata.enabled}
                    />
                  )}
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center w-24">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={metadataFields.genre}
                      onChange={(e) => handleMetadataFieldToggle('genre', e.target.checked)}
                      disabled={!metadata.enabled}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Genre</span>
                  </label>
                  
                  {metadataFields.genre && (
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Music genre"
                      value={metadataValues.genre}
                      onChange={(e) => handleMetadataValueChange('genre', e.target.value)}
                      disabled={!metadata.enabled}
                    />
                  )}
                </div>
              </div>
              
              {/* Format options */}
              <div className="mb-3">
                <label htmlFor="metadataSeparator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Separator:
                </label>
                <select
                  id="metadataSeparator"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={metadataFields.separator}
                  onChange={handleMetadataSeparatorChange}
                  disabled={!metadata.enabled}
                >
                  <option value=" - ">Dash with spaces ( - )</option>
                  <option value="-">Dash (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=".">Dot (.)</option>
                  <option value=" ">Space ( )</option>
                  <option value=" | ">Pipe with spaces ( | )</option>
                  <option value=" • ">Bullet with spaces ( • )</option>
                </select>
              </div>
              
              {/* Optional prefix/suffix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="metadataPrefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prefix (optional):
                  </label>
                  <input
                    id="metadataPrefix"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={metadataFields.prefix}
                    onChange={(e) => handleMetadataPreSuffixChange('prefix', e.target.value)}
                    disabled={!metadata.enabled}
                    placeholder="[MUSIC]"
                  />
                </div>
                
                <div>
                  <label htmlFor="metadataSuffix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Suffix (optional):
                  </label>
                  <input
                    id="metadataSuffix"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={metadataFields.suffix}
                    onChange={(e) => handleMetadataPreSuffixChange('suffix', e.target.value)}
                    disabled={!metadata.enabled}
                    placeholder="(favorite)"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Preview:</strong> <span className="font-mono">{metadata.pattern || "Select fields above"}</span>
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Note:</strong> Metadata extraction requires appropriate file types. EXIF works with JPEG, PNG, TIFF, etc. ID3 works with MP3, FLAC, etc.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Pattern examples:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
              <li>For music: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">{'{artist}'} - {'{title}'} ({'{album}'})</code></li>
              <li>For photos: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">{'{date}'}_shot_{'{camera}'}</code></li>
              <li>Custom formatting: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">MY_{'{artist}'}_FAVORITE</code></li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              <strong>Available tags for music:</strong> {'{artist}'}, {'{title}'}, {'{album}'}, {'{year}'}, {'{genre}'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Available tags for images:</strong> {'{date}'}, {'{camera}'}, {'{resolution}'}, {'{location}'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedRule; 