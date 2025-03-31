import React from 'react'
import Link from 'next/link'
import MainLayout from '@/layouts/MainLayout'
import theme from '@/utils/theme'

const DocumentationIndex = () => {
  const docSections = [
    {
      title: "Getting Started",
      description: "Set up reNamerX and learn the basics",
      link: "/docs/getting-started",
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Features",
      description: "Explore the powerful features of reNamerX",
      link: "/docs/features",
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Usage Guide",
      description: "Learn how to use reNamerX effectively",
      link: "/docs/usage-guide",
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "FAQ",
      description: "Answers to frequently asked questions",
      link: "/docs/faq",
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Troubleshooting",
      description: "Solve common issues and problems",
      link: "/docs/troubleshooting",
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers.",
      link: "/docs/api",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  return (
    <MainLayout title="reNamerX Documentation" description="Complete documentation for reNamerX - learn how to use all features and get the most out of the application.">
      <div className="relative py-16 bg-black overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-secondary/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="doc-section-title">Documentation</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-wilma">
              Everything you need to know about reNamerX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {docSections.map((section, index) => (
              <Link 
                href={section.link}
                key={index}
                className="doc-card flex flex-col h-full group"
              >
                <div className="doc-icon mb-4 text-primary group-hover:text-primary-light">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2 font-modern-girl cyberpunk-text group-hover:text-primary transition-colors duration-300">{section.title}</h2>
                <p className="text-gray-300 font-wilma group-hover:text-white transition-colors duration-300">{section.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="doc-card group p-8">
              <h2 className="text-xl font-bold mb-4 font-modern-girl cyberpunk-text group-hover:text-primary transition-colors duration-300">Quick Start</h2>
              <p className="text-gray-300 mb-6 font-wilma group-hover:text-white transition-colors duration-300">
                New to reNamerX? Get up and running in minutes with our quick start guide.
              </p>
              <Link href="/docs/getting-started" 
                className="cyberpunk-button-outline inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Started
              </Link>
            </div>

            <div className="doc-card group p-8">
              <h2 className="text-xl font-bold mb-4 font-modern-girl cyberpunk-text group-hover:text-primary transition-colors duration-300">Video Tutorials</h2>
              <p className="text-gray-300 mb-6 font-wilma group-hover:text-white transition-colors duration-300">
                Learn visually with our step-by-step video guides covering all major features.
              </p>
              <Link href="/docs/videos" 
                className="cyberpunk-button-outline inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Videos
              </Link>
            </div>

            <div className="doc-card group p-8">
              <h2 className="text-xl font-bold mb-4 font-modern-girl cyberpunk-text group-hover:text-primary transition-colors duration-300">Need Help?</h2>
              <p className="text-gray-300 mb-6 font-wilma group-hover:text-white transition-colors duration-300">
                Can't find what you're looking for? Get in touch with our support team.
              </p>
              <Link href="/contact" 
                className="cyberpunk-button-outline inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default DocumentationIndex 