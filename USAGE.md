# reNamerX User Guide

This document provides detailed instructions for using reNamerX to efficiently rename your files.

## Getting Started

### Main Interface Overview

The reNamerX interface is divided into three main panels:

1. **File List Panel** (Left): Displays all selected files with their current and new names
2. **Renaming Rules Panel** (Center): Contains tools and options for configuring renaming operations
3. **Preview Panel** (Right): Shows a preview of the renaming results before applying changes

### Selecting Files

There are two ways to select files for renaming:

- **Browse Files**: Click the "Browse Files" button to select individual files
- **Browse Folder**: Click the "Browse Folder" button to select all files in a directory

You can filter files by extension by using the filter options in the top toolbar.

## Renaming Operations

reNamerX offers several methods to rename your files:

### Add Text

Adds text at a specific position in the filename.

1. Select the "Add Text" option
2. Enter the text you want to add
3. Choose where to add the text:
   - At the beginning of the filename
   - At the end of the filename
   - At a specific position (enter the position number)
4. Click "Preview" to see the results

### Remove Text

Removes characters from specific positions in the filename.

1. Select the "Remove Text" option
2. Choose the removal method:
   - Remove a specific number of characters
   - Remove characters from position X to Y
   - Remove all characters after/before a specific position
3. Enter the position values
4. Click "Preview" to see the results

### Replace Text

Replaces specific text or patterns in the filename.

1. Select the "Replace Text" option
2. Enter the text or pattern to find
3. Enter the replacement text
4. Toggle "Use Regular Expressions" if needed
5. Toggle "Case Sensitive" if needed
6. Click "Preview" to see the results

### Case Conversion

Changes the case format of the filename.

1. Select the "Case Conversion" option
2. Choose a case format:
   - UPPERCASE
   - lowercase
   - Title Case (First Letter Of Each Word)
   - Sentence case (First letter of sentence)
3. Click "Preview" to see the results

### Numbering

Adds sequential numbers to filenames.

1. Select the "Numbering" option
2. Configure the numbering options:
   - Starting number
   - Increment
   - Number of digits (padding with zeros)
   - Position (start, end, or specific position)
   - Separator character (e.g., "-", "_")
3. Click "Preview" to see the results

## Advanced Features

### File Selection and Filtering

- **Select All**: Click the checkbox in the column header to select all files
- **Invert Selection**: Right-click and choose "Invert Selection"
- **Filter by Type**: Use the filter dropdown to show only specific file types
- **Sort Files**: Click column headers to sort by name, size, or date

### Preview and Apply

1. After configuring your renaming rules, the preview panel automatically shows the new filenames
2. Check for any warnings or errors (highlighted in red)
3. Click "Apply" to rename the files

### Managing Undo Operations

1. After renaming files, the "Undo" button becomes active
2. Click "Undo" to revert the most recent batch of renamed files
3. The undo history keeps track of multiple rename operations

## Keyboard Shortcuts

reNamerX supports the following keyboard shortcuts for faster workflow:

- **Ctrl+O**: Open file selection dialog
- **Ctrl+D**: Open folder selection dialog
- **Ctrl+Z**: Undo last rename operation
- **Ctrl+A**: Select all files
- **Ctrl+Enter**: Apply rename rules
- **Esc**: Clear current selection
- **Delete**: Remove selected files from the list

## Best Practices

1. **Start with a backup**: While reNamerX includes undo functionality, it's always good practice to have a backup of important files before batch renaming.

2. **Use the preview**: Always check the preview before applying changes to ensure the results match your expectations.

3. **Incremental changes**: For complex renaming tasks, consider making changes in multiple smaller steps rather than one complex operation.

4. **Avoid illegal characters**: Remember that certain characters are not allowed in filenames on different operating systems: \ / : * ? " < > |

5. **Use descriptive names**: Choose filenames that describe the content and are easy to search for later.

## Troubleshooting

### Common Issues

- **Files Not Showing**: Ensure you have appropriate permissions to access the selected files
- **Cannot Rename**: Check if files are locked by another application
- **Undo Not Working**: Ensure the application has write permissions to the file locations

### Error Messages

- **"File in use"**: Close any applications that might be using the file
- **"Invalid characters"**: Remove any illegal characters from your renaming pattern
- **"Path too long"**: Shorten the target filename to stay within system limits

## Getting Help

If you encounter any issues or have questions about using reNamerX, please:

1. Check the documentation for answers
2. Visit our GitHub repository at [GitHub](#) for known issues
3. Submit a bug report with detailed information about the problem 