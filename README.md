# reNamerX

![GitHub release (latest by date)](https://img.shields.io/github/v/release/Gcavazo1/reNamerX)
![GitHub all releases](https://img.shields.io/github/downloads/Gcavazo1/reNamerX/total)
![GitHub issues](https://img.shields.io/github/issues/Gcavazo1/reNamerX)
![License](https://img.shields.io/github/license/Gcavazo1/reNamerX)

A powerful desktop file batch renaming application developed by Gabriel Cavazos (GigaCode).

![reNamerX Screenshot](https://raw.githubusercontent.com/Gcavazo1/reNamerX/master/src/assets/Screenshot_00.jpg)

## Features

- **Intuitive Interface**: Clean, modern user interface with dark and cyberpunk theme support
- **Powerful Renaming Rules**: Text operations, case transformation, sequential numbering
- **Smart Undo System**: Safely undo any batch rename operation with Ctrl+Z
- **Live Preview**: See how your files will be renamed before applying changes
- **Batch Processing**: Rename hundreds of files at once with consistent rules
- **Cross-platform**: Built with Tauri for Windows (macOS and Linux coming soon)

## Installation

### Windows

1. Download the latest Windows installer from [Releases](https://github.com/Gcavazo1/reNamerX/releases/latest)
2. Choose either:
   - MSI installer (recommended): `reNamerX_1.0.0_x64_en-US.msi`
   - EXE installer: `reNamerX_1.0.0_x64-setup.exe`
3. Run the installer and follow the installation wizard
4. Launch reNamerX from the Start Menu or desktop shortcut

## Usage

### Basic Workflow

1. Click "Browse Files" to select individual files or "Browse Folder" to select all files in a directory
2. Configure your renaming rules in the right panel
3. Preview changes in real-time
4. Click "Apply" to execute the rename operation
5. Use Ctrl+Z to undo operations if needed

## Keyboard Shortcuts

- **Ctrl+O**: Open file selection dialog
- **Ctrl+D**: Open folder selection dialog
- **Ctrl+Z**: Undo last rename operation
- **Ctrl+Y** or **Ctrl+Shift+Z**: Redo operation
- **Ctrl+Shift+R**: Apply rename rules
- **Ctrl+A**: Select all files
- **Ctrl+N**: Invert selection
- **Ctrl+P**: Toggle preview mode
- **Ctrl+K**: Clear selected files
- **Escape**: Deselect all files
- **Ctrl+Alt+S**: Save current rules as preset
- **Ctrl+Shift+T**: Toggle dark/light theme
- **Ctrl+H**: Show keyboard shortcuts
- **Ctrl+/**: Focus search box

## Development

### Building from Source

1. Clone the repository:
```bash
git clone https://github.com/Gcavazo1/reNamerX.git
cd reNamerX
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run tauri dev
```

4. Build the application:
```bash
npm run tauri build
```

The installers will be created in:
- `src-tauri/target/release/bundle/msi/` (MSI installer)
- `src-tauri/target/release/bundle/nsis/` (EXE installer)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About the Developer

reNamerX is developed by Gabriel Cavazos (GigaCode), a software developer focused on creating efficient desktop tools.

## Acknowledgments

- Built with [Tauri](https://tauri.app/), [React](https://reactjs.org/), and [TailwindCSS](https://tailwindcss.com/)
- Uses [Zustand](https://github.com/pmndrs/zustand) for state management
