import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InfoTip } from '../components/common/InfoTip';
import ShortcutHelp from '../components/common/ShortcutHelp';

// Mock Tooltip component
jest.mock('../components/common/Tooltip', () => ({
  __esModule: true,
  default: ({ children, content }: { children: React.ReactNode, content: React.ReactNode }) => (
    <div data-testid="mock-tooltip" data-content={content}>
      {children}
    </div>
  )
}));

describe('UI Components', () => {
  describe('InfoTip', () => {
    const testContent = 'Test tooltip content';
    
    test('renders info icon with tooltip', () => {
      render(<InfoTip content={testContent} />);
      
      // Check that the info icon is rendered
      const icon = screen.getByTestId('info-icon');
      expect(icon).toBeInTheDocument();
      
      // Check that the tooltip is rendered with the correct content
      const tooltip = screen.getByTestId('mock-tooltip');
      expect(tooltip).toHaveAttribute('data-content', testContent);
    });
    
    test('applies custom class name', () => {
      const customClass = 'custom-class';
      render(<InfoTip content={testContent} className={customClass} />);
      
      const container = screen.getByTestId('info-tip');
      expect(container).toHaveClass(customClass);
    });
  });
  
  describe('ShortcutHelp', () => {
    test('renders help button', () => {
      render(<ShortcutHelp />);
      
      // Check that the help button is rendered
      const button = screen.getByTitle('Keyboard shortcuts');
      expect(button).toBeInTheDocument();
    });
    
    test('toggles help panel on click', () => {
      render(<ShortcutHelp />);
      
      // Initially, the help panel should not be visible
      expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
      
      // Click the help button
      fireEvent.click(screen.getByTitle('Keyboard shortcuts'));
      
      // The help panel should now be visible
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
      
      // Click the help button again
      fireEvent.click(screen.getByTitle('Keyboard shortcuts'));
      
      // The help panel should be hidden again
      expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
    });
    
    test('displays shortcut list when opened', () => {
      render(<ShortcutHelp />);
      
      // Open the help panel
      fireEvent.click(screen.getByTitle('Keyboard shortcuts'));
      
      // Check that the shortcuts are listed
      expect(screen.getByText('Select all files')).toBeInTheDocument();
      expect(screen.getByText('Toggle preview mode')).toBeInTheDocument();
      expect(screen.getByText('Clear all files')).toBeInTheDocument();
      expect(screen.getByText('Deselect all files')).toBeInTheDocument();
      
      // Check for keyboard key elements
      expect(screen.getByText('Ctrl')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('P')).toBeInTheDocument();
      expect(screen.getByText('Shift')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
      expect(screen.getByText('Escape')).toBeInTheDocument();
    });
    
    test('closes when close button is clicked', () => {
      render(<ShortcutHelp />);
      
      // Open the help panel
      fireEvent.click(screen.getByTitle('Keyboard shortcuts'));
      
      // The help panel should be visible
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
      
      // Click the close button
      fireEvent.click(screen.getByRole('button', { name: '' }));
      
      // The help panel should be hidden
      expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
    });
  });
}); 