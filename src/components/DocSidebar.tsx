import React from 'react'
import Link from 'next/link'
import theme from '@/utils/theme'

interface DocSidebarProps {
  currentPath: string;
  sections?: Array<{
    id: string;
    title: string;
  }>;
  otherDocs?: Array<{
    path: string;
    title: string;
  }>;
}

const DocSidebar: React.FC<DocSidebarProps> = ({ currentPath, sections = [], otherDocs = [] }) => {
  // Standard documentation pages
  const standardDocs = [
    { path: '/docs/getting-started', title: 'Getting Started' },
    { path: '/docs/features', title: 'Features' },
    { path: '/docs/usage-guide', title: 'Usage Guide' },
    { path: '/docs/faq', title: 'FAQ' },
    { path: '/docs/troubleshooting', title: 'Troubleshooting' }
  ];

  return (
    <div className="w-full lg:w-64 mb-8 lg:mb-0">
      <div className="sticky top-24">
        {/* Page sections navigation */}
        {sections.length > 0 && (
          <div className="mb-8 bg-black/70 p-4 rounded-lg border border-primary/20 backdrop-blur-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 font-modern-girl text-primary">On This Page</h4>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-1 px-2 text-gray-300 hover:text-primary transition-colors duration-200 font-wilma hover:bg-primary/10 rounded hover:translate-x-1"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Documentation navigation */}
        <div className="bg-black/70 p-4 rounded-lg border border-primary/20 backdrop-blur-sm">
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4 font-modern-girl text-primary">Documentation</h4>
          <nav className="space-y-2">
            {standardDocs.map((doc) => (
              <Link 
                key={doc.path}
                href={doc.path}
                className={
                  currentPath === doc.path
                    ? "block py-2 px-3 bg-primary/20 text-primary border-l-2 border-primary rounded font-wilma font-medium transition-all duration-200"
                    : "block py-2 px-3 text-gray-300 hover:text-primary hover:bg-primary/10 border-l-2 border-transparent hover:border-primary/50 rounded font-wilma transition-all duration-200"
                }
              >
                {doc.title}
              </Link>
            ))}

            {otherDocs.length > 0 && (
              <>
                <div className="border-t border-primary/20 my-3"></div>
                {otherDocs.map((doc) => (
                  <Link
                    key={doc.path}
                    href={doc.path}
                    className={
                      currentPath === doc.path
                        ? "block py-2 px-3 bg-primary/20 text-primary border-l-2 border-primary rounded font-wilma font-medium transition-all duration-200"
                        : "block py-2 px-3 text-gray-300 hover:text-primary hover:bg-primary/10 border-l-2 border-transparent hover:border-primary/50 rounded font-wilma transition-all duration-200"
                    }
                  >
                    {doc.title}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 space-y-4">
          <Link
            href="/docs"
            className="cyberpunk-button-outline inline-flex items-center w-full justify-center text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Documentation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocSidebar; 