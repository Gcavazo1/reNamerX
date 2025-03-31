import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import Markdown from '@/components/Markdown'
import DocSidebar from '@/components/DocSidebar'

// Content for the getting started guide in markdown format
const gettingStartedContent = `
# Getting Started with reNamerX

Welcome to reNamerX! This guide will help you get up and running quickly with this powerful file renaming utility.

## System Requirements

reNamerX has the following minimal system requirements:

- **Operating System**: Windows 10 or 11 (64-bit)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Disk Space**: 200MB available storage
- **Display**: 1280×800 resolution or higher

## Installation

### Standard Installation

1. Download the latest installer from the [download page](/download)
2. Run the installer and follow the on-screen instructions
3. Choose your preferred installation location or accept the default
4. Once installation completes, launch reNamerX from the Start menu or desktop shortcut

### Portable Version

If you prefer not to install the application:

1. Download the portable ZIP package from the [download page](/download)
2. Extract the ZIP file to any location of your choice
3. Run the reNamerX.exe file directly - no installation required
4. Settings will be stored in the same folder as the application

## First Launch

When you first launch reNamerX, you'll be greeted with a clean interface divided into three main sections:

1. **Files Panel** (left): For adding and selecting files to rename
2. **Rules Panel** (right): For creating and configuring renaming rules
3. **Action Bar** (bottom): Contains buttons for applying renames and other actions

By default, the application uses a dark cyberpunk theme. If you prefer a lighter theme, you can change this in Settings → Appearance.

## Your First Renaming Operation

Let's walk through a simple renaming operation to get you started:

### 1. Adding Files

First, add some files you'd like to rename:

1. Click the "Add Files" button in the top-left corner
2. Browse to a folder containing files you want to rename
3. Select one or more files and click "Open"
4. Alternatively, you can drag files directly from Windows Explorer into reNamerX

### 2. Creating a Renaming Rule

Now, let's create a simple rule to modify the filenames:

1. In the Rules panel, select "Replace Text" from the dropdown menu
2. In the "Find" field, enter the text you want to replace
3. In the "Replace with" field, enter the replacement text
4. You'll see a preview of the changes in the Files panel

### 3. Applying the Rename

Once you're satisfied with the preview:

1. Click the "Apply" button in the Action bar
2. reNamerX will rename all selected files according to your rules
3. You'll see a confirmation message once the operation completes
4. If you make a mistake, you can press Ctrl+Z or click "Undo" to revert the changes

## Next Steps

Now that you've completed your first renaming operation, here are some next steps to explore:

- Try different rule types like "Add Numbers" or "Change Case"
- Combine multiple rules to create more complex renaming patterns
- Save your frequently used rule combinations as presets
- Explore keyboard shortcuts for faster workflow (listed in the Help menu)
- Check out the [Usage Guide](/docs/usage-guide) for more detailed information

Congratulations! You're now ready to use reNamerX for all your file renaming needs. If you have any questions or encounter issues, refer to our [FAQ](/docs/faq) or [Troubleshooting](/docs/troubleshooting) pages.
`;

// Section identifiers for navigation
const sections = [
  { id: 'system-requirements', title: 'System Requirements' },
  { id: 'installation', title: 'Installation' },
  { id: 'first-launch', title: 'First Launch' },
  { id: 'your-first-renaming-operation', title: 'First Renaming Operation' },
  { id: 'next-steps', title: 'Next Steps' }
];

export default function GettingStarted() {
  return (
    <MainLayout 
      title="Getting Started with reNamerX" 
      description="Learn how to install and start using reNamerX for batch file renaming. A quick guide to get up and running with basic operations."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <DocSidebar currentPath="/docs/getting-started" sections={sections} />
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="sr-only">Getting Started with reNamerX</h1>
            <Markdown content={gettingStartedContent} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 