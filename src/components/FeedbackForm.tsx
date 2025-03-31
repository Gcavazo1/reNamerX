import React, { useState } from 'react'

type FeedbackFormProps = {
  // Add any props if needed
}

type FeedbackType = 'feature' | 'bug' | 'experience'

const FeedbackForm: React.FC<FeedbackFormProps> = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feature')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !message) {
      setError('Please fill out all required fields.')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Here you would typically send the data to your backend or a service
      // For demonstration, we'll just simulate an API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Clear form
      setName('')
      setEmail('')
      setMessage('')
      setFeedbackType('feature')
      
      // Show success message
      setIsSubmitted(true)
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (err) {
      setError('An error occurred while submitting your feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background-alt p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-4">Send Your Feedback</h2>
      
      {isSubmitted ? (
        <div className="bg-success/20 border border-success text-text-primary px-4 py-3 rounded mb-4">
          <p className="text-text-secondary mb-4">Your feedback has been submitted successfully.</p>
          <p>Thank you for helping us improve reNamerX!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error/20 border border-error text-text-primary px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
              Your Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-background border border-border rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
              Your Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-background border border-border rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Feedback Type <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'feature', label: 'Feature Request' },
                { id: 'bug', label: 'Bug Report' },
                { id: 'experience', label: 'User Experience' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    feedbackType === type.id 
                    ? 'bg-primary text-text-inverse border border-primary' 
                    : 'border-border text-text-secondary hover:border-primary'
                  }`}
                  onClick={() => setFeedbackType(type.id as FeedbackType)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
              Your Message <span className="text-error">*</span>
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full bg-background border border-border rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-text-inverse font-bold py-3 px-6 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  )
}

export default FeedbackForm 