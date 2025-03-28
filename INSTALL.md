# reNamerX Installation Guide

This document provides detailed instructions for installing reNamerX on different operating systems.

## System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 20.04+, Fedora 36+, or other modern distributions

## Windows Installation

### Using the Installer (Recommended)

1. Download the latest `.exe` installer from the [Releases](#) page
2. Double-click the downloaded file to start the installation process
3. Follow the on-screen instructions to complete the installation
4. Launch reNamerX from the Start Menu or desktop shortcut

### Using the MSI Package (Alternative)

1. Download the latest `.msi` package from the [Releases](#) page
2. Double-click the downloaded file to start the installation process
3. Follow the on-screen instructions to complete the installation
4. Launch reNamerX from the Start Menu or desktop shortcut

### Manual Installation (Portable)

1. Download the `.zip` archive from the [Releases](#) page
2. Extract the contents to a folder of your choice
3. Run `reNamerX.exe` to start the application

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

## Troubleshooting

### Windows

- **Application Won't Start**: Ensure you have the latest Microsoft Visual C++ Redistributable installed
- **Permission Errors**: Try running the installer as administrator
- **File Association Issues**: Right-click any file, select "Open with" and choose reNamerX if you want to associate file types with the application

### macOS

- **"App is damaged"**: Right-click the app and select "Open" to bypass Gatekeeper
- **"App can't be opened"**: Go to System Preferences > Security & Privacy and click "Open Anyway"
- **App Not Responding**: Check Activity Monitor and force quit if necessary, then restart the application

### Linux

- **Missing Libraries**: Install the required dependencies:
  ```bash
  # Ubuntu/Debian
  sudo apt install libwebkit2gtk-4.0-dev libgtk-3-dev libappindicator3-dev
  
  # Fedora
  sudo dnf install webkit2gtk3-devel gtk3-devel libappindicator-gtk3-devel
  ```

- **AppImage Not Launching**: Ensure you've made the AppImage executable with chmod
- **Permission Denied**: Check that you have write access to the directories where files will be renamed

## Uninstallation

### Windows

1. Open Control Panel > Programs > Programs and Features
2. Select reNamerX and click "Uninstall"
3. Follow the uninstallation wizard

### macOS

1. Drag the reNamerX application from Applications to Trash
2. Empty the Trash

### Linux

#### AppImage

1. Delete the AppImage file

#### Debian/Ubuntu

```bash
sudo apt remove renamerx
```

#### Fedora/RHEL

```bash
sudo dnf remove renamerx
```

## Getting Help

If you encounter any installation issues, please:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Visit our [GitHub Issues](https://github.com/YOUR-USERNAME/renamerx/issues) page
3. Submit a detailed bug report including your operating system version and steps to reproduce the issue 