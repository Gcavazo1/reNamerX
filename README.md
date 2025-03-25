# reNamerX

A powerful desktop file renaming utility with metadata extraction capabilities.

## Features

- **Intuitive Interface**: Simple and modern user interface with dark and cyberpunk themes
- **Powerful Renaming Rules**: Text operations, case transformation, sequential numbering, and more
- **Metadata Extraction**: Extract and use metadata from audio files (MP3, FLAC) and images (JPEG, PNG, TIFF)
- **Pattern-based Renaming**: Use patterns with placeholders for consistent naming conventions
- **Live Preview**: See how your files will be renamed before applying changes
- **Preset Management**: Save and load your favorite renaming configurations

## Installation

### Windows

1. Download the latest installer from [Releases](https://github.com/renamerx/app/releases)
2. Run the installer and follow the installation wizard
3. Launch reNamerX from the Start Menu or desktop shortcut

### macOS

1. Download the latest .dmg file from [Releases](https://github.com/renamerx/app/releases)
2. Open the .dmg file and drag reNamerX to your Applications folder
3. Launch reNamerX from your Applications folder or Launchpad

### Linux

1. Download the appropriate package for your distribution from [Releases](https://github.com/renamerx/app/releases)
2. Install the package using your package manager
3. Launch reNamerX from your applications menu

## Usage

### Basic Renaming

1. Click "Browse Files" or "Browse Folder" to select files for renaming
2. Configure your renaming rules in the Basic Rules tab
3. Use the Preview panel to see how your files will be renamed
4. Click "Apply Changes" to rename your files

### Metadata Extraction

1. Select audio or image files
2. Go to the Advanced Rules tab and enable Metadata
3. Configure the metadata pattern using placeholders like `{artist}`, `{title}`, etc.
4. Preview and apply the changes

## Development

### Prerequisites

- Node.js 16+
- Rust 1.68+
- Tauri CLI

### Setup

```bash
# Clone the repository
git clone https://github.com/renamerx/app.git
cd renamerx

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run build:tauri
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Tauri](https://tauri.app/), [React](https://reactjs.org/), and [TailwindCSS](https://tailwindcss.com/)
- Icon design by ReNamerX Team
