import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

// Section identifiers for navigation
const sections = [
  { id: 'version-1-0-0', title: 'Version 1.0.0' },
  { id: 'version-0-9-0', title: 'Version 0.9.0 (Beta)' },
  { id: 'version-0-8-0', title: 'Version 0.8.0 (Alpha)' }
];

export default function Changelog() {
  return (
    <MainLayout title="reNamerX Changelog" description="Complete version history and release notes for reNamerX">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center">Changelog</h1>
        
        <div className="max-w-4xl mx-auto bg-dark-lighter rounded-lg p-8 mb-12">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 id="version-1-0-0" className="text-3xl font-bold text-primary">Version 1.0.0</h2>
              <span className="text-text-muted">Released on March 28, 2024</span>
            </div>
            
            <div className="border-l-4 border-primary pl-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Initial Public Release</h3>
              <p className="mb-4">Our first stable release of reNamerX, featuring a complete batch file renaming solution with an intuitive interface.</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">New Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete core renaming functionality with support for multiple operations</li>
                  <li>Drag-and-drop file and folder selection</li>
                  <li>Live preview of filename changes</li>
                  <li>Modern cyberpunk-themed UI with light/dark mode support</li>
                  <li>Proper Windows OS integration</li>
                  <li>Save and load renaming operations as presets</li>
                  <li>Regex pattern support with testing tool</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Improvements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enhanced performance for large file sets</li>
                  <li>More responsive UI with better error handling</li>
                  <li>Simplified workflow for common operations</li>
                  <li>Added comprehensive documentation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Bug Fixes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fixed file path handling for special characters</li>
                  <li>Resolved Unicode text support issues</li>
                  <li>Fixed window sizing on high DPI displays</li>
                  <li>Corrected various UI rendering glitches from beta</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-right">
              <a
                href="https://github.com/Gcavazo1/reNamerX/releases/tag/v1.0.0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end text-primary hover:text-secondary transition-colors"
              >
                <FaGithub className="mr-2" />
                View on GitHub
              </a>
            </div>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 id="version-0-9-0" className="text-3xl font-bold text-primary">Version 0.9.0 (Beta)</h2>
              <span className="text-text-muted">Released on February 15, 2024</span>
            </div>
            
            <div className="border-l-4 border-primary pl-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Beta Release</h3>
              <p className="mb-4">The beta release focused on UI refinement and bug fixes based on alpha tester feedback.</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">New Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Added preset management system</li>
                  <li>Implemented context menu integration</li>
                  <li>Added support for folder renaming</li>
                  <li>Included basic file filtering options</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Improvements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Redesigned main interface with better controls</li>
                  <li>Improved operation sequencing logic</li>
                  <li>Enhanced undo functionality</li>
                  <li>Better error reporting with clearer messages</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Bug Fixes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fixed file locking issues during batch operations</li>
                  <li>Resolved preview panel synchronization problems</li>
                  <li>Fixed memory leaks in file handling routines</li>
                  <li>Multiple UI stability improvements</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-right">
              <a
                href="https://github.com/Gcavazo1/reNamerX/releases/tag/v0.9.0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end text-primary hover:text-secondary transition-colors"
              >
                <FaGithub className="mr-2" />
                View on GitHub
              </a>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 id="version-0-8-0" className="text-3xl font-bold text-primary">Version 0.8.0 (Alpha)</h2>
              <span className="text-text-muted">Released on December 8, 2023</span>
            </div>
            
            <div className="border-l-4 border-primary pl-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Alpha Release</h3>
              <p className="mb-4">Our initial alpha release focused on core functionality and basic interface.</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Initial Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Basic file selection and renaming</li>
                  <li>Core renaming operations (replace, insert, remove, etc.)</li>
                  <li>Simple preview system</li>
                  <li>Initial UI design</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-secondary">Known Issues</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Performance limitations with large file sets</li>
                  <li>UI stability issues on certain configurations</li>
                  <li>Limited error handling</li>
                  <li>No support for special file types</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-right">
              <a
                href="https://github.com/Gcavazo1/reNamerX/releases/tag/v0.8.0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end text-primary hover:text-secondary transition-colors"
              >
                <FaGithub className="mr-2" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <div className="bg-dark-lighter rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Looking for the latest version?</h2>
            <p className="mb-6">
              Download the most recent version of reNamerX to get all the newest features and bug fixes.
            </p>
            <Link href="/download" className="cyberpunk-button inline-block">
              Download reNamerX
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 