# Contributing to reNamerX

Thank you for your interest in contributing to reNamerX! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites

- Node.js 16+ (for React/Vite development)
- Rust 1.68+ (for Tauri backend)
- Git

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/renamerx.git`
3. Install dependencies: `npm install`
4. Run the development server: `npm run tauri dev`

## Development Workflow

### Branch Naming Convention

- `feature/your-feature-name` for new features
- `bugfix/issue-description` for bug fixes
- `docs/description` for documentation changes
- `refactor/description` for code refactoring

### Commit Message Guidelines

Please use clear and descriptive commit messages following this format:
```
type: Brief description

Detailed description if necessary
```

Types include:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Pull Request Process

1. Update the README.md and other documentation with details of changes if appropriate
2. Make sure your code passes all tests
3. Submit a pull request to the `main` branch
4. Your PR will be reviewed by the maintainers

## Code Style

### JavaScript/TypeScript

- Use TypeScript for all new code
- Follow ESLint configuration included in the project
- Use functional components with hooks for React
- Use MobX for state management

### Rust

- Follow the Rust style guide
- Use the included `rustfmt` configuration
- Document public API functions

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- For UI components, include basic rendering tests

## Documentation

- Update documentation for any new features or changes
- Keep code comments up to date
- Add JSDoc comments for functions and components

## Questions?

If you have any questions about contributing, please open an issue with your question or contact the maintainers directly.

Thank you for your contributions! 