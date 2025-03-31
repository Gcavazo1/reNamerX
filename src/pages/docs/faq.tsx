import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import Markdown from '@/components/Markdown'
import DocSidebar from '@/components/DocSidebar'

// Content for the FAQ page in markdown format
const faqContent = `
# Frequently Asked Questions

This FAQ addresses common questions about reNamerX. If you don't find what you're looking for, please refer to our other documentation pages or contact us.

## General Questions

### What is reNamerX?
reNamerX is a powerful file batch renaming utility with a modern cyberpunk interface, designed to make file organization easy and efficient. It allows you to rename multiple files at once using various rules and patterns.

### What operating systems does reNamerX support?
Currently, reNamerX is available for Windows 10 and 11 (64-bit). We're evaluating support for macOS and Linux in the future.

### Is reNamerX free to use?
Yes, reNamerX is currently free to use. We may introduce a premium version with additional features in the future, but the core functionality will remain free.

### Where can I download reNamerX?
You can download reNamerX from our [download page](/download) or directly from the [GitHub releases](https://github.com/Gcavazo1/reNamerX/releases) page.

### How do I report a bug or request a feature?
You can report bugs or request features through our [GitHub issues page](https://github.com/Gcavazo1/reNamerX/issues). Please check existing issues first to avoid duplicates.

## Installation & Updates

### What are the prerequisites for installing reNamerX?
reNamerX requires Windows 10 or 11 (64-bit), .NET Framework 4.7.2 or later, and approximately 200MB of disk space.

### Is there a portable version of reNamerX?
Yes, we offer a portable version that doesn't require installation. You can download it from our website and run it directly from a USB drive or any folder.

### How do I update reNamerX to the latest version?
Currently, you need to download and install the latest version manually. Simply download the latest version from our website and run the installer, which will replace your existing installation.

### Will reNamerX automatically check for updates?
Not yet, but we plan to add automatic update checking in a future version.

## Usage Questions

### How many files can reNamerX process at once?
reNamerX can handle thousands of files in a single batch, though performance may vary depending on your system specifications and the complexity of the renaming rules.

### How do I undo a renaming operation?
After renaming files, you can use the Undo button or press Ctrl+Z to revert to the original filenames. reNamerX keeps track of the original names to make this possible.

### Can I rename files across multiple folders?
Yes, you can add files from different folders to reNamerX and rename them in a single operation. However, files will remain in their original folders after renaming.

### Does reNamerX support regular expressions?
Yes, reNamerX has full support for regular expressions (regex) for advanced pattern matching and replacement. This allows for extremely powerful and flexible renaming operations.

### Can I save my renaming patterns to use them later?
Yes, you can save your configuration of renaming rules as presets. These can be loaded later for similar renaming tasks, saving you time and ensuring consistency.

### Can reNamerX rename files based on their metadata (EXIF, ID3, etc.)?
Yes, reNamerX can extract metadata from various file types, including EXIF data from images and ID3 tags from music files, and use this information in renaming operations.

## Troubleshooting

### I get "Access Denied" errors when trying to rename certain files
This typically happens when files are in use by another application or you don't have sufficient permissions. Close any programs that might be using the files and try running reNamerX as administrator.

### Some files show a "Filename conflicts" error
This occurs when two or more files would end up with the same name after renaming. Modify your renaming rules to ensure unique filenames, or enable the automatic conflict resolution option in Settings.

### I added a folder but can't see all the files
By default, reNamerX only shows files in the immediate folder, not in subfolders. To include files from subfolders, check the "Include Subfolders" option when adding a folder.

## Advanced Features

### How do I use capture groups in regex replacements?
When using regex replacements, you can use parentheses to create capture groups. These are referenced in the replacement string using $1, $2, etc., where the number corresponds to the capture group's position.

### Can I combine multiple renaming rules?
Yes, you can add multiple rules that will be applied in sequence. Each rule builds on the result of the previous one, allowing for complex renaming operations.

### How do I export/import my presets?
You can export presets to share them with others or back them up. Go to the Presets menu, select "Manage Presets," and use the export option. To import, use the "Import Preset" option in the same menu.

### Is there a command-line interface for reNamerX?
Not currently, but we plan to add command-line support in a future version to enable automation and scripting.
`;

// Section identifiers for navigation
const sections = [
  { id: 'general-questions', title: 'General Questions' },
  { id: 'installation--updates', title: 'Installation & Updates' },
  { id: 'usage-questions', title: 'Usage Questions' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'advanced-features', title: 'Advanced Features' }
];

export default function Faq() {
  return (
    <MainLayout 
      title="reNamerX FAQ" 
      description="Frequently asked questions about reNamerX. Find answers about installation, usage, features, and troubleshooting for the batch file renaming utility."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <DocSidebar currentPath="/docs/faq" sections={sections} />
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="sr-only">reNamerX FAQ</h1>
            <Markdown content={faqContent} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 