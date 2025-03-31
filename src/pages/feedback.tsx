import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import FeedbackForm from '@/components/FeedbackForm'

export default function Feedback() {
  return (
    <MainLayout title="Feedback - reNamerX" description="Share your thoughts, suggestions, and bug reports to help improve reNamerX.">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Feedback</h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Your feedback helps make reNamerX better for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="cyberpunk-card">
            <div className="mb-4 text-primary">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Suggest a Feature</h2>
            <p className="text-text-muted mb-4">
              Have an idea for a new feature? Let us know! We're constantly looking to improve reNamerX with user suggestions.
            </p>
          </div>

          <div className="cyberpunk-card">
            <div className="mb-4 text-primary">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Report a Bug</h2>
            <p className="text-text-muted mb-4">
              Encountered a problem? Let us know the details so we can fix it in the next release.
            </p>
          </div>

          <div className="cyberpunk-card">
            <div className="mb-4 text-primary">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Share Your Experience</h2>
            <p className="text-text-muted mb-4">
              Tell us how you're using reNamerX and what you think of it. Your experience helps guide our development.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <FeedbackForm />
        </div>
      </div>
    </MainLayout>
  )
} 