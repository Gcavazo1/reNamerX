import React from 'react'
import Link from 'next/link'

/**
 * A wrapper around Next.js Link component that prevents path duplication
 */
interface SafeLinkProps {
  href: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export default function SafeLink({ href, className, children, onClick }: SafeLinkProps) {
  // Clean any /reNamerX/ prefix from the path
  const cleanHref = href.replace(/^\/?reNamerX\//, '/');
  
  return (
    <Link 
      href={cleanHref}
      className={className} 
      onClick={onClick}
    >
      {children}
    </Link>
  )
} 