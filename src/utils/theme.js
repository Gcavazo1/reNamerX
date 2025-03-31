/**
 * Theme Configuration
 * 
 * This file defines the core design tokens and color palettes for the reNamerX website.
 * It serves as a single source of truth for styling values used throughout the application.
 */

// Main color palette
const colors = {
  // Primary colors
  primary: {
    DEFAULT: 'var(--color-primary)',
    light: 'var(--color-primary-light)',
    dark: 'var(--color-primary-dark)',
  },
  
  // Secondary accent colors
  secondary: {
    DEFAULT: 'var(--color-secondary)',
    light: 'var(--color-secondary-light)',
    dark: 'var(--color-secondary-dark)',
  },
  
  // Dark theme colors
  dark: {
    DEFAULT: 'var(--color-dark)',
    lighter: 'var(--color-dark-lighter)',
    light: 'var(--color-dark-light)',
  },
  
  // Text colors
  text: {
    DEFAULT: 'var(--color-text)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
  },

  // Status colors
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
};

// Font settings
const fonts = {
  sans: [
    'Inter',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'JetBrains Mono',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
};

// Spacing scale (consistent with Tailwind defaults)
const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
};

// Breakpoints for responsive design
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Shadow definitions
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 15px var(--color-primary-light)',
  'cyberpunk-glow': '0 0 10px var(--color-primary), 0 0 20px var(--color-secondary-light)',
};

// Common style utilities
const styles = {
  // Generate consistent link styles for navigation, docs, etc.
  linkClasses: {
    // Standard text link
    standard: 'text-text-muted hover:text-text transition-colors',
    // Primary accent link
    primary: 'text-text-muted hover:text-primary transition-colors',
    // Documentation sidebar link
    docSidebar: 'text-text-muted hover:text-primary block py-1.5',
    // Documentation navigation link
    docNav: 'text-text-muted hover:text-primary flex items-center gap-1',
    // Footer link
    footer: 'text-text-muted hover:text-text transition-colors',
  },
  
  // Button variants
  buttonClasses: {
    primary: 'cyberpunk-button',
    secondary: 'px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-dark rounded transition-colors',
    outline: 'px-4 py-2 border border-text text-text hover:border-primary hover:text-primary transition-colors rounded',
    text: 'text-primary hover:text-secondary underline transition-colors',
  }
};

// Export theme configuration
const theme = {
  colors,
  fonts,
  spacing,
  breakpoints,
  shadows,
  styles,
};

module.exports = theme; 