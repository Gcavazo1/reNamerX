import React, { ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <LoadingOverlay />
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl font-bold">File Rename Tool</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          File Rename Tool © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout; 