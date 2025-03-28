# reNamerX Release Checklist

Use this checklist to ensure your reNamerX release is ready for distribution.

## Pre-Release Testing

- [ ] Test all core functionality:
  - [ ] File selection (individual files and folders)
  - [ ] All renaming operations (Add, Remove, Replace, Case, Numbering)
  - [ ] Preview functionality
  - [ ] Apply rename operations
  - [ ] Undo functionality
  - [ ] Keyboard shortcuts

- [ ] Cross-platform testing:
  - [ ] Windows 10/11
  - [ ] macOS
  - [ ] Linux (if applicable)

- [ ] Error handling:
  - [ ] Test with invalid input
  - [ ] Test with large batches of files
  - [ ] Test with files that have special characters
  - [ ] Test with files in use by other applications
  - [ ] Test with files that require elevated permissions

## Build Process

- [x] Update version numbers in:
  - [x] package.json
  - [x] Cargo.toml
  - [x] tauri.conf.json

- [x] Clean and rebuild:
  - [x] `npm prune --production` (remove dev dependencies)
  - [x] Edit build script to skip TypeScript compilation
  - [x] Run `npm run tauri build`

- [ ] Verify build artifacts:
  - [ ] Windows: Check `.exe` installer and `.msi` package
  - [ ] macOS: Check `.dmg` package
  - [ ] Linux: Check `.AppImage` and/or `.deb`/`.rpm` packages

## Documentation

- [x] Update documentation:
  - [x] README.md with current features and instructions
  - [x] INSTALL.md with detailed installation instructions
  - [x] USAGE.md with comprehensive user guide

- [ ] Update website or GitHub repository:
  - [ ] Upload new screenshots
  - [ ] Update feature list
  - [ ] Update download links

## Distribution Preparation

- [ ] Create release notes highlighting:
  - [ ] New features
  - [ ] Bug fixes
  - [ ] Known issues
  - [ ] Breaking changes (if any)

- [ ] Prepare distribution channels:
  - [ ] GitHub Releases
  - [ ] Website updates
  - [ ] Social media announcements

- [ ] Code signing (if applicable):
  - [ ] Windows: Sign EXE/MSI with certificate
  - [ ] macOS: Sign with Apple Developer ID

## Post-Release

- [ ] Monitor for issues:
  - [ ] Set up error reporting or feedback channels
  - [ ] Monitor GitHub issues

- [ ] Plan for future releases:
  - [ ] Gather user feedback
  - [ ] Prioritize backlog items for next version

## Final Verification

- [ ] Install from distribution package on clean system
- [ ] Verify all functionality works as expected
- [ ] Check startup performance
- [ ] Verify uninstallation process

## Release Command

Once all checks are complete, create a new release in your repository with:

```bash
# Tag the release
git tag -a v1.0.0 -m "reNamerX v1.0.0"
git push origin v1.0.0

# Create GitHub release (if using GitHub)
# Upload build artifacts to the release
``` 