/** @type {import('tailwindcss').Config} */
const theme = require('./src/utils/theme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        // Status colors
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          dark: 'var(--color-success-dark)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          dark: 'var(--color-error-dark)',
        },
        // Background colors
        background: {
          DEFAULT: 'var(--color-background)',
          alt: 'var(--color-background-alt)',
          'alt-dark': 'var(--color-background-alt-dark)',
        },
        // Text colors
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        // Border colors
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
        },
        // Status colors for file operations
        status: {
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
          error: 'var(--color-status-error)',
          pending: 'var(--color-status-pending)',
          default: 'var(--color-status-default)',
        },
        // Cyberpunk colors
        neon: {
          blue: '#00ccff',
          purple: '#9933ff',
          pink: '#ff00cc',
          green: '#00ff99',
          yellow: '#ffcc00',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        'modern-girl': ['"Modern Girl"', 'sans-serif'],
        'wilma': ['"Wilma Mankiller"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/reNamerX/images/reNamerX_heroBackground.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyberpunk-gradient': `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
        'neon-blue-gradient': 'linear-gradient(to right, #00ccff 20%, #0099ff)',
        'neon-pink-gradient': 'linear-gradient(to right, #ff00cc, #ff66cc)',
        'neon-multi-gradient': 'linear-gradient(to right, #ff00cc, #9933ff, #00ccff)',
      },
      boxShadow: {
        ...theme.shadows,
        'neon-blue': '0 0 5px rgba(0, 204, 255, 0.5), 0 0 20px rgba(0, 204, 255, 0.3)',
        'neon-blue-lg': '0 0 10px rgba(0, 204, 255, 0.7), 0 0 30px rgba(0, 204, 255, 0.4)',
        'neon-pink': '0 0 5px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)',
        'neon-pink-lg': '0 0 10px rgba(255, 0, 204, 0.7), 0 0 30px rgba(255, 0, 204, 0.4)',
        'glow': '0 0 15px rgba(0, 204, 255, 0.7), 0 0 30px rgba(0, 204, 255, 0.3)',
      },
      textShadow: {
        'neon-blue': '0 0 5px rgba(0, 204, 255, 0.8), 0 0 10px rgba(0, 204, 255, 0.4)',
        'neon-blue-lg': '0 0 10px rgba(0, 204, 255, 0.8), 0 0 20px rgba(0, 204, 255, 0.5)',
        'neon-pink': '0 0 5px rgba(255, 0, 204, 0.8), 0 0 10px rgba(255, 0, 204, 0.4)',
        'neon-pink-lg': '0 0 10px rgba(255, 0, 204, 0.8), 0 0 20px rgba(255, 0, 204, 0.5)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-fast': 'glow 1.5s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'text-flicker': 'textFlicker 5s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #ff00ff, 0 0 10px #ff00ff' },
          '100%': { textShadow: '0 0 10px #00ccff, 0 0 20px #00ccff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        textFlicker: {
          '0%, 100%': { opacity: '1' },
          '8%, 10%': { opacity: '0.8' },
          '20%, 25%': { opacity: '0.9' },
          '48%, 50%': { opacity: '0.8' },
          '70%, 80%': { opacity: '0.9' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(0, 204, 255, 0.5), 0 0 20px rgba(0, 204, 255, 0.2)',
            opacity: '0.9'
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(0, 204, 255, 0.7), 0 0 30px rgba(0, 204, 255, 0.4)',
            opacity: '1'
          },
        },
      },
    },
  },
  plugins: [
    // Add custom text shadow plugin
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-neon-blue': {
          textShadow: '0 0 5px rgba(0, 204, 255, 0.8), 0 0 10px rgba(0, 204, 255, 0.4)',
        },
        '.text-shadow-neon-pink': {
          textShadow: '0 0 5px rgba(255, 0, 204, 0.8), 0 0 10px rgba(255, 0, 204, 0.4)',
        },
        '.text-shadow-neon-blue-lg': {
          textShadow: '0 0 10px rgba(0, 204, 255, 0.8), 0 0 20px rgba(0, 204, 255, 0.5), 0 0 30px rgba(0, 204, 255, 0.3)',
        },
        '.text-shadow-neon-pink-lg': {
          textShadow: '0 0 10px rgba(255, 0, 204, 0.8), 0 0 20px rgba(255, 0, 204, 0.5), 0 0 30px rgba(255, 0, 204, 0.3)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
} 