import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import Markdown from '@/components/Markdown'
import DocSidebar from '@/components/DocSidebar'

// Content for the usage guide in markdown format
const usageGuideContent = `
# reNamerX Usage Guide

This comprehensive guide will help you understand how to use reNamerX effectively for file renaming tasks.

## Interface Overview

reNamerX features a clean, intuitive interface divided into three main sections:

- **Files Panel**: Where you select and manage files to be renamed
- **Rules Panel**: Where you create and configure renaming rules
- **Action Bar**: Contains buttons for applying renames and other actions

The application uses a cyberpunk theme with a dark background and bright accent colors for better visibility. You can also switch to a light theme in the settings if preferred.

## Working with Files

### Selecting Files

There are multiple ways to add files to reNamerX:

1. **Browse for Files**: Click the "Add Files" button to open a file browser
2. **Browse for Folders**: Click the "Add Folder" button to add all files from a folder
3. **Drag and Drop**: Drag files or folders directly into the application window
4. **Command Line Arguments**: Launch reNamerX with file paths as arguments

### Managing Selected Files

Once files are added, you can:

- **Select All**: Use Ctrl+A or the "Select All" option in the right-click menu
- **Invert Selection**: Toggle between selected and unselected files
- **Clear Selection**: Deselect all files without removing them from the list
- **Remove Files**: Delete files from the list (not from disk)
- **Sort Files**: Sort by name, path, size, or date modified

### File Filtering

Use the search box to filter displayed files:

- Type text to show only matching files
- Use wildcards like * and ? for more flexible matching
- Filter by file extension (e.g., *.jpg)

## Creating Renaming Rules

### Basic Text Operations

- **Replace Text**: Substitute specific text with new text
- **Add Text**: Insert text at beginning, end, or specific position
- **Remove Text**: Delete characters from specific positions

### Case Transformations

- **UPPERCASE**: Convert to all capital letters
- **lowercase**: Convert to all small letters
- **Title Case**: Capitalize first letter of each word
- **Sentence case**: Capitalize only the first letter of the first word

### Sequential Numbering

Add sequential numbers to filenames with options for:

- Starting number
- Increment value
- Padding (number of digits)
- Position (prefix, suffix, or custom position)

### Date and Time

Add date/time information with various format options:

- Current date/time
- File creation/modification date
- Custom date format strings

## Advanced Techniques

### Regular Expressions

For complex renaming patterns, use regular expressions:

1. Enable RegEx mode in the Replace rule
2. Enter a pattern in the "Find" field
3. Use capture groups (...) to reference matched text in the replacement

Example: To change date format from MM-DD-YYYY to YYYY-MM-DD:
- Find: \`(\d{2})-(\d{2})-(\d{4})\`
- Replace: \`$3-$1-$2\`

### Presets

Save frequently used rule combinations:

1. Configure your rules
2. Click "Save Preset"
3. Name your preset
4. Access saved presets from the Presets menu

## Keyboard Shortcuts

reNamerX offers keyboard shortcuts for faster workflow:

| Action | Shortcut |
|--------|----------|
| Open files | Ctrl+O |
| Open folder | Ctrl+Shift+O |
| Select all files | Ctrl+A |
| Apply rename | F2 or Ctrl+R |
| Preview changes | F3 or Ctrl+P |
| Add rule | Ctrl+N |
| Delete rule | Del |
| Move rule up | Ctrl+Up |
| Move rule down | Ctrl+Down |
| Save preset | Ctrl+S |
| Toggle dark/light theme | Ctrl+T |

## Best Practices

For optimal results with reNamerX:

1. **Use the Preview**: Always preview changes before applying
2. **Start Small**: When working with many files, test with a few first
3. **Use Presets**: Save complex rule combinations for repeated use
4. **Combine Rules**: Stack multiple rules to achieve complex renames
5. **Regular Backups**: While reNamerX has undo functionality, backups are recommended for large operations
`;

// Section identifiers for navigation
const sections = [
  { id: 'interface-overview', title: 'Interface Overview' },
  { id: 'working-with-files', title: 'Working with Files' },
  { id: 'creating-renaming-rules', title: 'Creating Renaming Rules' },
  { id: 'advanced-techniques', title: 'Advanced Techniques' },
  { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts' },
  { id: 'best-practices', title: 'Best Practices' }
];

export default function UsageGuide() {
  return (
    <MainLayout 
      title="reNamerX Usage Guide" 
      description="Learn how to use reNamerX effectively, including file selection, renaming rules, advanced techniques, and keyboard shortcuts."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <DocSidebar currentPath="/docs/usage-guide" sections={sections} />
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="sr-only">reNamerX Usage Guide</h1>
            <Markdown content={usageGuideContent} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 