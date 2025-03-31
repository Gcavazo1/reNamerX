import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import Markdown from '@/components/Markdown'
import DocSidebar from '@/components/DocSidebar'

// Content for the troubleshooting guide in markdown format
const troubleshootingContent = `
# reNamerX Troubleshooting Guide

This guide addresses common issues you might encounter while using reNamerX and provides solutions to help you resolve them quickly.

## Installation Issues

### Error: "Unable to install reNamerX"

**Possible causes:**
- Insufficient permissions
- Antivirus blocking installation
- Corrupted installer file

**Solutions:**
1. Run the installer as Administrator (right-click → Run as Administrator)
2. Temporarily disable your antivirus software during installation
3. Re-download the installer from the official website
4. Verify you have at least 200MB of free disk space

### Error: "Application failed to initialize"

**Possible causes:**
- Missing prerequisites (.NET Framework)
- Incomplete installation

**Solutions:**
1. Install the latest .NET Framework from Microsoft's website
2. Try uninstalling and reinstalling reNamerX
3. Use the portable version instead of the installer

## Startup Problems

### reNamerX Won't Launch

**Possible causes:**
- Corrupted configuration file
- Missing dependencies
- Issues with app data

**Solutions:**
1. Reset reNamerX by deleting the configuration file in %AppData%\\reNamerX
2. Reinstall the application
3. Check Windows Event Viewer for detailed error information
4. Try running in compatibility mode for Windows 10

### Slow Application Startup

**Possible causes:**
- Large preset database
- Too many saved operations in history
- System resource limitations

**Solutions:**
1. Clear application history (Settings → General → Clear History)
2. Remove unused presets (Presets → Manage Presets)
3. Close resource-intensive applications when using reNamerX
4. Check for system updates

## File Selection Issues

### Unable to Add Files

**Possible causes:**
- File in use by another application
- Insufficient permissions
- Path too long (exceeding system limits)

**Solutions:**
1. Close any applications that might be using the files
2. Run reNamerX as Administrator
3. Move files to a location with a shorter path
4. Check if the files exist and are accessible

### Files Not Showing in List

**Possible causes:**
- Active filter is hiding files
- Files are not compatible
- Directory access issues

**Solutions:**
1. Clear the search/filter box
2. Check if you have read permissions for the directory
3. Verify the files aren't hidden or system files
4. Try adding the containing folder instead of individual files

## Renaming Issues

### "Access Denied" Errors

**Possible causes:**
- Files are in use by another application
- Insufficient permissions
- Files are read-only

**Solutions:**
1. Close any applications that might be using the files
2. Run reNamerX as Administrator
3. Check file properties and uncheck "Read-only"
4. Try using the "Safe Mode" renaming option (slower but more compatible)

### File Name Conflicts

**Possible causes:**
- Renaming would result in duplicate file names
- Invalid characters in new file names
- File name would exceed system limits

**Solutions:**
1. Enable the "Auto Resolve Conflicts" option in Settings
2. Review preview before applying to identify conflicts
3. Modify your rules to ensure unique names (e.g., add numbering)
4. Check for invalid characters like \\ / : * ? " < > |

### Undo Not Working

**Possible causes:**
- Files were modified after renaming
- Files were moved or deleted
- System changes prevent reverting

**Solutions:**
1. Always use the Undo function immediately after renaming
2. Don't move or modify files between rename and undo operations
3. Use the operation history to see previous rename details
4. Consider creating a backup before large rename operations

## Performance Issues

### Slow Preview Generation

**Possible causes:**
- Large number of files
- Complex regular expressions
- System resource limitations

**Solutions:**
1. Work with smaller batches of files
2. Simplify regular expressions where possible
3. Close other resource-intensive applications
4. Increase the preview delay in Settings

### Application Freezes

**Possible causes:**
- Processing too many files simultaneously
- Recursive operations causing high CPU usage
- Memory limitations

**Solutions:**
1. Work with smaller batches of files
2. Avoid extremely complex regular expressions with many lookups
3. Restart the application to clear memory
4. Update to the latest version, which may include performance improvements

## Preferences and Settings Issues

### Settings Not Saving

**Possible causes:**
- Insufficient permissions for settings file
- Corrupted configuration
- Path issues

**Solutions:**
1. Run reNamerX as Administrator when changing settings
2. Reset settings to default (Settings → Reset to Default)
3. Check if the %AppData% folder is accessible
4. Try the portable version which stores settings locally

### Custom Presets Missing

**Possible causes:**
- Preset file corruption
- Accidental deletion
- Import/export issues

**Solutions:**
1. Check the presets directory in %AppData%\\reNamerX\\Presets
2. Restore from a backup if available
3. Export presets regularly to prevent future loss
4. Reinstall the application but keep the %AppData% folder intact

## Recovery and Undo

### How to Recover From Unwanted Rename

If you've performed a rename operation and need to revert it:

1. Immediately use the Undo function (Ctrl+Z or Edit → Undo)
2. Check the Operation History (View → Operation History)
3. Use the "Reverse Operation" feature on a past operation
4. If undo isn't possible, use a file recovery tool to restore from backups

## Still Having Problems?

If you're experiencing issues not covered in this guide:

1. Check the [reNamerX FAQ](/docs/faq) for additional information
2. Search or post on the [GitHub Issues](https://github.com/Gcavazo1/reNamerX/issues) page
3. Contact support at support@renamerx.com with:
   - A detailed description of the issue
   - Steps to reproduce
   - Your system information
   - Screenshots if applicable
`;

// Section identifiers for navigation
const sections = [
  { id: 'installation-issues', title: 'Installation Issues' },
  { id: 'startup-problems', title: 'Startup Problems' },
  { id: 'file-selection-issues', title: 'File Selection Issues' },
  { id: 'renaming-issues', title: 'Renaming Issues' },
  { id: 'performance-issues', title: 'Performance Issues' },
  { id: 'preferences-and-settings-issues', title: 'Settings Issues' },
  { id: 'recovery-and-undo', title: 'Recovery and Undo' },
  { id: 'still-having-problems', title: 'Further Help' }
];

export default function Troubleshooting() {
  return (
    <MainLayout 
      title="reNamerX Troubleshooting Guide" 
      description="Solve common issues with reNamerX. Find solutions for installation problems, file access issues, and other troubleshooting tips."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <DocSidebar currentPath="/docs/troubleshooting" sections={sections} />
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="sr-only">reNamerX Troubleshooting</h1>
            <Markdown content={troubleshootingContent} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 