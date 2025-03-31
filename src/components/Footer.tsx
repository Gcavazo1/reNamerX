import React from 'react'
import Link from 'next/link'
import { FaGithub, FaTwitter, FaHeart, FaLinkedin } from 'react-icons/fa'
import { withBasePath } from '@/utils/paths'
import SafeLink from './SafeLink'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <SafeLink href="/" className="footer-logo">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">re</span>
              <span className="text-white">Namer</span>
              <span style={{ color: "#ffcc00" }}>X</span>
            </SafeLink>
            <p className="text-gray-400 mb-4 font-wilma">
              Powerful batch file renaming tool for Windows, macOS, and Linux. Rename multiple files with patterns, counters, and more.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Gcavazo1/reNamerX"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/GigaCodeDev"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/gabriel-cavazos"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Documentation</h3>
            <ul className="space-y-2 font-wilma">
              <li>
                <SafeLink
                  href="/docs/getting-started"
                  className="footer-link"
                >
                  Getting Started
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/docs/features"
                  className="footer-link"
                >
                  Features
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/docs/usage-guide"
                  className="footer-link"
                >
                  Usage Guide
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/docs/faq"
                  className="footer-link"
                >
                  FAQ
                </SafeLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Links</h3>
            <ul className="space-y-2 font-wilma">
              <li>
                <SafeLink
                  href="/download"
                  className="footer-link"
                >
                  Download
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/contact"
                  className="footer-link"
                >
                  Contact
                </SafeLink>
              </li>
              <li>
                <a
                  href="https://github.com/Gcavazo1/reNamerX/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Report Issues
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Gcavazo1/reNamerX/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-copyright font-wilma">
          <p>
            &copy; {currentYear} reNamerX. All rights reserved.
          </p>
          <p className="mt-2">
            Made with <FaHeart className="footer-love-icon" /> by{' '}
            <a
              href="https://github.com/Gcavazo1"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-author"
            >
              Gabriel Cavazos
            </a>{' '}
            (GigaCode)
          </p>
        </div>
      </div>
    </footer>
  )
} 