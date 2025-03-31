import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import { FaWindows, FaMobileAlt, FaApple, FaLinux, FaGithub } from 'react-icons/fa'
import Link from 'next/link'

export default function Download() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center">Download reNamerX</h1>

        <div className="max-w-3xl mx-auto bg-dark-lighter rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Current Version: v1.0.0</h2>
          <p className="mb-6">
            Released on March 28, 2024 - 
            <Link href="/changelog" className="text-primary hover:text-secondary underline ml-1">
              View Changelog
            </Link>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cyberpunk-card p-6">
              <div className="flex items-center mb-4">
                <FaWindows className="text-primary text-2xl mr-3" />
                <h3 className="text-xl font-bold">Windows</h3>
              </div>
              <p className="mb-4 text-text-muted">Requires Windows 10 or newer</p>
              <div className="space-y-3">
                <a 
                  href="https://github.com/Gcavazo1/reNamerX/releases/download/v1.0.0/reNamerX_1.0.0_x64-setup.exe" 
                  className="cyberpunk-button block text-center"
                >
                  Download Installer (.exe)
                </a>
                <a 
                  href="https://github.com/Gcavazo1/reNamerX/releases/download/v1.0.0/reNamerX_1.0.0_x64_en-US.msi" 
                  className="block text-center py-2 px-4 border border-primary text-primary hover:bg-primary hover:text-black transition-colors rounded"
                >
                  Download MSI Installer (.msi)
                </a>
              </div>
            </div>

            <div className="cyberpunk-card p-6">
              <div className="flex items-center mb-4">
                <FaApple className="text-primary text-2xl mr-3" />
                <h3 className="text-xl font-bold">macOS</h3>
              </div>
              <p className="mb-4 text-text-muted">Coming soon</p>
              <div className="space-y-3">
                <button 
                  disabled
                  className="cyberpunk-button block w-full text-center opacity-50 cursor-not-allowed"
                >
                  Download (.dmg) - Coming Soon
                </button>
                <button 
                  disabled
                  className="block w-full text-center py-2 px-4 border border-text-muted text-text-muted rounded opacity-50 cursor-not-allowed"
                >
                  Download (.zip) - Coming Soon
                </button>
              </div>
            </div>

            <div className="cyberpunk-card p-6">
              <div className="flex items-center mb-4">
                <FaLinux className="text-primary text-2xl mr-3" />
                <h3 className="text-xl font-bold">Linux</h3>
              </div>
              <p className="mb-4 text-text-muted">Coming soon</p>
              <div className="space-y-3">
                <button 
                  disabled
                  className="cyberpunk-button block w-full text-center opacity-50 cursor-not-allowed"
                >
                  Download (.AppImage) - Coming Soon
                </button>
                <button 
                  disabled
                  className="block w-full text-center py-2 px-4 border border-text-muted text-text-muted rounded opacity-50 cursor-not-allowed"
                >
                  Download (.deb) - Coming Soon
                </button>
              </div>
            </div>

            <div className="cyberpunk-card p-6">
              <div className="flex items-center mb-4">
                <FaMobileAlt className="text-primary text-2xl mr-3" />
                <h3 className="text-xl font-bold">Mobile</h3>
              </div>
              <p className="mb-4 text-text-muted">Android app coming soon!</p>
              <div className="space-y-3">
                <button 
                  disabled
                  className="cyberpunk-button block w-full text-center opacity-50 cursor-not-allowed"
                >
                  Android (Coming Soon)
                </button>
                <button 
                  disabled
                  className="block w-full text-center py-2 px-4 border border-text-muted text-text-muted rounded opacity-50 cursor-not-allowed"
                >
                  iOS (Under Consideration)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-dark-lighter rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Source Code</h2>
          <p className="mb-6">
            You can download the source code directly or access it through GitHub.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="https://github.com/Gcavazo1/reNamerX/archive/refs/tags/v1.0.0.zip" 
              className="cyberpunk-card p-6 block hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-bold mb-4">Source code (.zip)</h3>
              <p className="text-text-muted">Download the source code as a ZIP archive</p>
            </a>
            
            <a 
              href="https://github.com/Gcavazo1/reNamerX/archive/refs/tags/v1.0.0.tar.gz" 
              className="cyberpunk-card p-6 block hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-bold mb-4">Source code (.tar.gz)</h3>
              <p className="text-text-muted">Download the source code as a TAR.GZ archive</p>
            </a>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-lighter rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaGithub className="mr-3" />
              Source Code
            </h2>
            <p className="mb-6">
              reNamerX is open source software. You can view the source code, contribute to the project, or report issues on GitHub.
            </p>
            <a 
              href="https://github.com/Gcavazo1/reNamerX" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cyberpunk-button inline-block"
            >
              View on GitHub
            </a>
          </div>

          <div className="bg-dark-lighter rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 border border-dark-light rounded-lg">
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <FaWindows className="mr-2 text-primary" /> Windows
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-text-secondary">
                  <li>Windows 10 or newer</li>
                  <li>4GB RAM minimum</li>
                  <li>200MB free disk space</li>
                  <li>1280×720 screen resolution</li>
                </ul>
              </div>
              
              <div className="p-4 border border-dark-light rounded-lg">
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <FaApple className="mr-2 text-primary" /> macOS
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-text-secondary">
                  <li>macOS 10.15 or newer</li>
                  <li>4GB RAM minimum</li>
                  <li>200MB free disk space</li>
                  <li>1280×720 screen resolution</li>
                </ul>
              </div>
              
              <div className="p-4 border border-dark-light rounded-lg">
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <FaLinux className="mr-2 text-primary" /> Linux
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-text-secondary">
                  <li>Modern Linux distribution</li>
                  <li>4GB RAM minimum</li>
                  <li>200MB free disk space</li>
                  <li>1280×720 screen resolution</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-dark p-4 rounded-lg border-l-4 border-secondary">
              <p className="text-text-secondary">
                <strong className="text-secondary">Note:</strong> While reNamerX may work on older operating systems, we officially support and test only on the versions listed above.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Having trouble with your download?</h2>
          <p className="mb-6">
            If you're experiencing issues downloading or installing reNamerX, please check our troubleshooting guide or contact support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/docs/troubleshooting" className="cyberpunk-button block sm:inline-block">
              Troubleshooting Guide
            </Link>
            <Link href="/contact" className="block sm:inline-block py-2 px-6 border border-primary text-primary hover:bg-primary hover:text-black transition-colors rounded">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 