import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MainLayout from '@/layouts/MainLayout'
import FeatureCard from '@/components/FeatureCard'
import FeedbackForm from '@/components/FeedbackForm'
import { getBasePath } from '@/utils/paths'
import Head from 'next/head'
import { FaGithub, FaDownload, FaArrowRight, FaCode } from 'react-icons/fa'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { withBasePath } from '@/utils/paths'
import SafeLink from '@/components/SafeLink'

const Home = () => {
  const router = useRouter()
  
  // Features data
  const features = [
    {
      title: 'Powerful Batch Renaming',
      description: 'Rename hundreds of files at once with powerful rule-based patterns and precise control.',
      icon: 'rename-batch',
    },
    {
      title: 'Multiple Rules',
      description: 'Apply several renaming operations in sequence to achieve complex file naming patterns.',
      icon: 'rules',
    },
    {
      title: 'Regular Expressions',
      description: 'Use regular expressions for advanced pattern matching and replacement in filenames.',
      icon: 'regex',
    },
    {
      title: 'Metadata Support',
      description: 'Rename files based on their metadata like creation date, size, or EXIF data for images.',
      icon: 'metadata',
    },
    {
      title: 'Save & Load Presets',
      description: 'Save your renaming configurations as presets and reuse them later.',
      icon: 'preset',
    },
    {
      title: 'Preview Changes',
      description: 'Preview the results before applying any changes to ensure accuracy.',
      icon: 'preview',
    },
  ]

  return (
    <MainLayout
      title="reNamerX - Batch File Renaming Tool"
      description="Powerful batch file renaming tool for Windows, macOS and Linux. Easily rename multiple files with patterns, counters, and more."
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="flex flex-col items-start">
            <h1 className="hero-title mb-2 font-modern-girl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">re</span>
              <span className="text-white">Namer</span>
              <span style={{ color: "#ffcc00" }}>X</span>
            </h1>
            <h2 className="hero-subtitle mb-6 font-modern-girl">Powerful Batch File Renaming</h2>
            <p className="hero-description font-wilma">
              Rename hundreds of files in seconds with precision and control. Built for efficiency with a modern cyberpunk interface.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <SafeLink 
                href="/download"
                className="cyberpunk-button font-modern-girl"
              >
                <FaDownload className="mr-2" />
                DOWNLOAD NOW
              </SafeLink>
              <SafeLink
                href="/docs"
                className="cyberpunk-button-outline font-modern-girl"
              >
                <FaCode className="mr-2" />
                DOCUMENTATION
              </SafeLink>
            </div>
            <div className="flex space-x-3 mt-6">
              <div className="status-badge status-badge-version font-wilma">
                release v1.0.0
              </div>
              <div className="status-badge status-badge-downloads font-wilma">
                downloads 0
              </div>
              <div className="status-badge status-badge-license font-wilma">
                license MIT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background-alt">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-modern-girl">Why Choose reNamerX?</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto font-wilma">
              reNamerX combines powerful features with a user-friendly interface to make batch file renaming simple and efficient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="cyberpunk-card">
              <h3 className="text-xl font-bold mb-3 font-modern-girl">Powerful Batch Renaming</h3>
              <p className="mb-4 font-wilma">
                Rename hundreds of files at once with customizable patterns and powerful rules.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="cyberpunk-card">
              <h3 className="text-xl font-bold mb-3 font-modern-girl">Cross-Platform</h3>
              <p className="mb-4 font-wilma">
                Available for Windows, macOS, and Linux so you can use it on any computer.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="cyberpunk-card">
              <h3 className="text-xl font-bold mb-3 font-modern-girl">Regular Expressions</h3>
              <p className="mb-4 font-wilma">
                Advanced pattern matching with regular expressions for complex renaming scenarios.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="cyberpunk-card">
              <h3 className="text-xl font-bold mb-3 font-modern-girl">Live Preview</h3>
              <p className="mb-4 font-wilma">
                See how your files will be renamed before applying changes to avoid mistakes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="cyberpunk-card">
              <h3 className="text-xl font-bold mb-3 font-modern-girl">Metadata Integration</h3>
              <p className="mb-4 font-wilma">
                Rename files based on their metadata like creation date, size, and more.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="cyberpunk-card">
              <h3 className="text-xl font-bold mb-3 font-modern-girl">Modern UI</h3>
              <p className="mb-4 font-wilma">
                Clean, intuitive interface that makes complex renaming operations simple.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <SafeLink
              href="/docs/features"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium font-modern-girl transition-colors"
            >
              <span>See all features</span>
              <FaArrowRight className="ml-2" />
            </SafeLink>
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="section-heading">An Interface Designed for Efficiency</h2>
              <p className="text-lg mb-6 font-wilma">
                reNamerX features a clean, intuitive interface that puts all the power of batch file renaming at your fingertips. Our modern UI is designed to make complex operations feel simple.
              </p>
              <ul className="feature-list">
                <li>
                  <span className="check-icon text-xl">✓</span>
                  <span>Drag and drop file handling</span>
                </li>
                <li>
                  <span className="check-icon text-xl">✓</span>
                  <span>Instant previews of renamed files</span>
                </li>
                <li>
                  <span className="check-icon text-xl">✓</span>
                  <span>Dark mode support</span>
                </li>
                <li>
                  <span className="check-icon text-xl">✓</span>
                  <span>Keyboard shortcuts for power users</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="app-screenshot-container">
                <Image
                  src={`${getBasePath()}/images/renamerx-screenshot.jpg`}
                  alt="reNamerX Application Screenshot"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="screen-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="cta-heading">Ready to Transform How You Rename Files?</h2>
            <p className="text-xl mb-8 font-wilma text-gray-200">
              Download reNamerX today and experience the fastest way to rename multiple files with precision and ease.
              Join thousands of users who have streamlined their file management workflow.
            </p>
            <div className="cta-button-container">
              <SafeLink
                href="/download"
                className="cyberpunk-button font-modern-girl"
              >
                <FaDownload className="mr-2" />
                DOWNLOAD NOW
              </SafeLink>
              <a
                href="https://github.com/Gcavazo1/reNamerX"
                target="_blank"
                rel="noopener noreferrer"
                className="cyberpunk-button-outline font-modern-girl"
              >
                <FaGithub className="mr-2" />
                VIEW ON GITHUB
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

export default Home 