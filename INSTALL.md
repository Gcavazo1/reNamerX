# Installation Guide for reNamerX

## Windows Installation

### System Requirements
- Windows 10 or newer
- 64-bit operating system
- At least 50MB of free disk space
- 4GB RAM recommended

### Installation Methods

#### Method 1: MSI Installer (Recommended)
1. Download the latest MSI installer (`reNamerX_1.0.0_x64_en-US.msi`) from the [Releases page](https://github.com/Gcavazo1/reNamerX/releases/latest)
2. Double-click the downloaded MSI file
3. Follow the installation wizard:
   - Accept the license agreement
   - Choose the installation location (default is recommended)
   - Select whether to create desktop shortcut
   - Click "Install"
4. If prompted by Windows Defender or UAC, allow the installation to proceed
5. Click "Finish" when the installation is complete

#### Method 2: EXE Installer
1. Download the latest EXE installer (`reNamerX_1.0.0_x64-setup.exe`) from the [Releases page](https://github.com/Gcavazo1/reNamerX/releases/latest)
2. Double-click the downloaded EXE file
3. If prompted by Windows Defender or UAC, allow the installation to proceed
4. Follow the installation wizard
5. Click "Finish" when the installation is complete

### Launching the Application
- Launch from the Start Menu: Start → All Programs → reNamerX
- Launch from the desktop shortcut (if created during installation)

### Uninstalling
1. Open Control Panel → Programs → Programs and Features
2. Find "reNamerX" in the list
3. Right-click and select "Uninstall"
4. Follow the uninstallation wizard

## Building from Source

If you prefer to build the application from source, follow these steps:

### Prerequisites
- Node.js 16 or newer
- npm or yarn
- Rust and Cargo (for Tauri)
- Git

### Tauri Prerequisites
Tauri requires certain dependencies based on your platform. Follow the [official Tauri setup guide](https://tauri.app/v1/guides/getting-started/prerequisites) to install them.

### Build Steps

1. Clone the repository:
```bash
git clone https://github.com/Gcavazo1/reNamerX.git
cd reNamerX
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run tauri dev
```

4. Build the application:
```bash
npm run tauri build
```

5. Find the built installers in:
   - MSI: `src-tauri/target/release/bundle/msi/reNamerX_1.0.0_x64_en-US.msi`
   - EXE: `src-tauri/target/release/bundle/nsis/reNamerX_1.0.0_x64-setup.exe`

## Troubleshooting

### Common Installation Issues

#### "Windows protected your PC" message
1. Click "More info"
2. Click "Run anyway"

#### Application doesn't start after installation
1. Make sure your system meets the requirements
2. Try running as Administrator
3. Check Windows Event Viewer for error details

#### Missing DLL errors
1. Install the latest [Microsoft Visual C++ Redistributable](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist)
2. Ensure WebView2 Runtime is installed

For additional help, please [open an issue](https://github.com/Gcavazo1/reNamerX/issues/new) on GitHub.

## macOS Installation

### Using the DMG Package

1. Download the `.dmg` file from the [Releases](#) page
2. Double-click the downloaded file to mount it
3. Drag the reNamerX icon to the Applications folder
4. Eject the mounted disk image
5. Launch reNamerX from the Applications folder or Launchpad

### First Launch Security Notice

When launching reNamerX for the first time, macOS might display a security warning. To resolve this:

1. Right-click (or Control-click) the app icon and select "Open"
2. Click "Open" in the confirmation dialog
3. The app will now open and future launches won't display the warning

## Linux Installation

### AppImage (Universal Method)

1. Download the `.AppImage` file from the [Releases](#) page
2. Make it executable:
   ```bash
   chmod +x reNamerX-*.AppImage
   ```
3. Run the application:
   ```bash
   ./reNamerX-*.AppImage
   ```

### Debian/Ubuntu (.deb)

1. Download the `.deb` package from the [Releases](#) page
2. Install it using your package manager:
   ```bash
   sudo apt install ./reNamerX-*.deb
   ```
3. Launch reNamerX from your applications menu

### Fedora/RHEL (.rpm)

1. Download the `.rpm` package from the [Releases](#) page
2. Install it using your package manager:
   ```bash
   sudo dnf install ./reNamerX-*.rpm
   ```
3. Launch reNamerX from your applications menu

## Updating reNamerX

To update to the latest version:

1. Download the latest package for your platform from the [Releases](#) page
2. Install it using the same method as the initial installation
3. The installer will automatically replace the previous version

## Getting Help

If you encounter any installation issues, please:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Visit our [GitHub Issues](https://github.com/YOUR-USERNAME/renamerx/issues) page
3. Submit a detailed bug report including your operating system version and steps to reproduce the issue 