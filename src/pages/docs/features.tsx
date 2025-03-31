import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import Markdown from '@/components/Markdown'
import DocSidebar from '@/components/DocSidebar'

// In a real implementation, you would:
// 1. Use getStaticProps to fetch the markdown content at build time
// 2. Use a library like next-mdx-remote or react-markdown
// This is a simplified example to show the concept

// Content for the features page in markdown format
const featuresContent = `
# reNamerX Features

reNamerX is a powerful file batch renaming utility with a modern cyberpunk interface, designed to handle all your file renaming needs with speed and precision.

## User Interface

- **Dark Cyberpunk Theme**: A sleek, modern interface with neon accents for reduced eye strain during long sessions
- **Light Theme Option**: Switch to a light theme if preferred
- **Responsive Layout**: Resize panels and columns to optimize your workspace
- **File Preview Panel**: See before-and-after filenames before applying changes
- **Save Window Layout**: Preserve your custom workspace arrangement
- **Multilingual Support**: Interface available in multiple languages

## Renaming Operations

### Text Operations

- **Replace Text**: Find and replace specific text in filenames
- **Add Text**: Insert text at the beginning, end, or specific position
- **Remove Text**: Delete characters or patterns from filenames
- **Insert Text**: Add text at specific positions
- **Trim Text**: Remove leading/trailing spaces and specified characters

### Case Transformations

- **UPPERCASE**: Convert to all capital letters
- **lowercase**: Convert to all small letters
- **Title Case**: Capitalize the first letter of each word
- **Sentence case**: Capitalize only the first letter of the first word
- **camelCase**: Remove spaces and capitalize words (first word starts lowercase)
- **PascalCase**: Remove spaces and capitalize all words
- **snake_case**: Replace spaces with underscores and convert to lowercase
- **kebab-case**: Replace spaces with hyphens and convert to lowercase

### Numeric Operations

- **Sequential Numbering**: Add incrementing numbers to filenames
- **Padding Control**: Specify leading zeros (001, 002, etc.)
- **Start Number**: Define the first number in the sequence
- **Increment Step**: Use custom increments (2, 4, 6, etc.)
- **Random Numbers**: Add random numbers within a specified range

### Date and Time

- **Add Date/Time**: Insert current date/time in filenames
- **File Date**: Use file creation, modification, or access dates
- **Custom Formats**: Flexible date/time formatting options
- **Date Extraction**: Extract dates from existing filenames

## Advanced Features

### Regular Expressions (Regex)

- **Regex Support**: Use powerful regular expressions for complex pattern matching and replacement
- **Regex Assistant**: Help with building and testing regular expressions
- **Capture Groups**: Use matched patterns in replacement strings
- **Complex Pattern Matching**: Identify and transform specific patterns in filenames

### Metadata Integration

- **ID3 Tags**: Rename music files based on artist, album, track number
- **EXIF Data**: Rename photos based on camera model, date taken, resolution
- **Document Properties**: Utilize author, title, and creation date from documents
- **Custom Metadata**: Define custom metadata fields for specialized needs

### File Attributes

- **Extension Handling**: Change, remove, or normalize file extensions
- **File Size**: Include file size in the filename
- **File Type**: Add file type description to filenames
- **File Hash**: Generate and add MD5 or SHA checksums to filenames

## Workflow Enhancements

### Organization

- **Filters**: Quickly filter files by name, extension, size, or date
- **Sorting**: Sort files by various criteria for organized processing
- **Tags**: Add custom tags to group related renaming operations
- **Folders**: Process files across multiple folders

### Efficiency

- **Presets**: Save and load renaming configurations for repeated tasks
- **Batch Operations**: Process thousands of files at once
- **Copy to Clipboard**: Copy new filenames for use in other applications
- **Export List**: Export before/after filename lists in various formats
- **Command Line Support**: Run renaming operations from scripts or batch files

### Safety

- **Preview Changes**: See the results before applying them
- **Undo Operation**: Revert to original filenames if needed
- **Backup Creation**: Option to create a backup before renaming
- **Conflict Detection**: Identify and resolve potential filename conflicts
- **Safe Mode**: Prevent accidental overwrites and data loss

## System Integration

- **Windows Explorer Context Menu**: Right-click to send files to reNamerX
- **File Association**: Open specific file types directly in reNamerX
- **Drag and Drop**: Drag files from explorer directly into the application
- **Portable Version**: Run without installation from a USB drive
- **Multiple Instance Support**: Run several reNamerX windows simultaneously
`;

// Section identifiers for navigation
const sections = [
  { id: 'user-interface', title: 'User Interface' },
  { id: 'renaming-operations', title: 'Renaming Operations' },
  { id: 'advanced-features', title: 'Advanced Features' },
  { id: 'workflow-enhancements', title: 'Workflow Enhancements' },
  { id: 'system-integration', title: 'System Integration' }
];

export default function Features() {
  return (
    <MainLayout 
      title="reNamerX Features" 
      description="Discover all the powerful features of reNamerX - from basic renaming operations to advanced regex support and workflow enhancements."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <DocSidebar currentPath="/docs/features" sections={sections} />
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="sr-only">reNamerX Features</h1>
            <Markdown content={featuresContent} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 