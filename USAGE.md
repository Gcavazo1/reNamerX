# reNamerX User Guide

This guide covers all the features and functionality of reNamerX to help you efficiently rename your files.

## Table of Contents
- [Getting Started](#getting-started)
- [Interface Overview](#interface-overview)
- [Selecting Files](#selecting-files)
- [Renaming Rules](#renaming-rules)
- [Previewing Changes](#previewing-changes)
- [Applying Renames](#applying-renames)
- [Undo & Redo](#undo--redo)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Themes](#themes)
- [Tips & Tricks](#tips--tricks)

## Getting Started

After installing reNamerX, launch the application. You'll see a clean interface divided into two main sections:
- Left side: File selection and preview
- Right side: Renaming rules and options

## Interface Overview

### Main Sections
1. **Files Panel** - Select and manage files to rename
2. **Rules Panel** - Configure renaming rules and patterns
3. **Preview Panel** - See how files will be renamed before applying changes
4. **Action Bar** - Apply changes, undo operations, and access settings

### Top Bar Elements
- **Theme Toggle** - Switch between dark and cyberpunk themes
- **Undo Button** - Revert the most recent rename operation
- **Keyboard Shortcuts** - Access the keyboard shortcuts help panel

## Selecting Files

### Methods for Adding Files

1. **Open Files**
   - Click the "Browse Files" button
   - Use keyboard shortcut `Ctrl+O`
   - Select multiple files in the file picker dialog
   
2. **Open Directory**
   - Click the "Browse Folder" button
   - Use keyboard shortcut `Ctrl+D`
   - Select a folder to add all files within it

### Managing Selected Files

- **Select All Files**: Ctrl+A
- **Invert Selection**: Ctrl+N
- **Deselect All**: Press Escape
- **Remove Selected Files**: Click the "Clear Files" button or press Ctrl+K
- **Filter Files**: Use the search box to filter files by name

## Renaming Rules

reNamerX offers several types of renaming rules that can be combined to create powerful rename patterns:

### Text Operations

1. **Replace Text**
   - Replace specific text or patterns with new text
   - Supports case-sensitive and whole word matching
   - Option for regular expressions

2. **Add/Remove Text**
   - Add prefix or suffix to filenames
   - Remove specific number of characters from the start or end
   - Insert text at a specific position

3. **Change Case**
   - Convert to UPPERCASE, lowercase, Title Case, or Sentence case
   - Mixed case options (e.g., camelCase, snake_case)

### Numbering

1. **Sequential Numbering**
   - Add sequential numbers to filenames
   - Configure start number, increment, and padding
   - Choose number placement (prefix, suffix, or specific position)

2. **Date/Time**
   - Add current date/time to filenames
   - Customize date/time format
   - Use file creation or modification dates

### Advanced Rules

1. **Regular Expressions**
   - Use regex for complex pattern matching and replacement
   - Access captured groups in replacement string

2. **Rule Presets**
   - Save combinations of rules for reuse
   - Load saved presets for quick application

## Previewing Changes

The preview panel shows how your files will look after applying the rename rules:

1. **Preview Modes**
   - List view: Shows original and new names in a list
   - Side-by-side view: Two-column comparison of original and new names
   - Toggle between modes with the preview toggle or Ctrl+P

2. **Preview Features**
   - Real-time updates as rules are modified
   - Highlights valid and invalid names
   - Shows number of files that will be renamed

## Applying Renames

When you're satisfied with the preview:

1. Click the "Apply" button at the bottom of the window
2. Alternatively, use the keyboard shortcut Ctrl+Shift+R
3. Wait for the operation to complete
4. A success message will indicate how many files were renamed

## Undo & Redo

reNamerX keeps track of your rename operations:

1. **Undo**
   - Click the "Undo" button in the top right
   - Use keyboard shortcut Ctrl+Z
   - Undoes the most recent batch of renames

2. **Redo**
   - Use keyboard shortcut Ctrl+Y or Ctrl+Shift+Z
   - Redoes the most recently undone operation

## Keyboard Shortcuts

reNamerX provides numerous keyboard shortcuts for efficient workflow:

| Action | Shortcut |
|--------|----------|
| Open Files | Ctrl+O |
| Open Directory | Ctrl+D |
| Select All Files | Ctrl+A |
| Invert Selection | Ctrl+N |
| Clear Selected Files | Ctrl+K |
| Deselect All Files | Esc |
| Toggle Preview Mode | Ctrl+P |
| Apply Rename | Ctrl+Shift+R |
| Undo Operation | Ctrl+Z |
| Redo Operation | Ctrl+Y or Ctrl+Shift+Z |
| Save Rules Preset | Ctrl+Alt+S |
| Toggle Theme | Ctrl+Shift+T |
| Show Shortcuts | Ctrl+H |
| Focus Search | Ctrl+/ |

Access the complete list of shortcuts in the app by pressing Ctrl+H.

## Themes

reNamerX offers two visual themes:

1. **Dark Theme**
   - Dark background with light text
   - Reduced eye strain in low-light environments

2. **Cyberpunk Theme**
   - Vibrant color scheme with neon accents
   - High contrast interface

Toggle between themes using:
- The theme button in the top bar
- Keyboard shortcut Ctrl+Shift+T

## Tips & Tricks

### Efficient Workflows

1. **Save Rule Presets**
   - For frequently used rename patterns
   - Create a preset library for different types of files

2. **Batch Processing Large Numbers of Files**
   - Process files in smaller batches for better performance
   - Use more specific file filters to work with subsets

3. **Testing Complex Rules**
   - Create a small test batch before applying to many files
   - Use regex testing tools for complex pattern matching

4. **Using Search to Filter Files**
   - Filter files by extension: `.jpg`
   - Filter by common prefix/suffix: `IMG_` or `_FINAL`

### Advanced Tips

1. **Sequential Numbering Across Folders**
   - Number files across multiple folders with continuous sequence
   - Set the correct sort order before applying numbering

2. **Complex File Organization**
   - Use multiple rename operations in sequence
   - Take advantage of undo/redo to experiment with different approaches

3. **Regular Expression Power Usage**
   - Use backreferences in regex replacements: `$1`, `$2`
   - Capture and rearrange parts of filenames

## Getting Help

If you encounter issues or have questions:
1. Check this documentation for guidance
2. Look for your question in the GitHub repository's Issues section
3. Open a new issue if needed

Thank you for using reNamerX! 