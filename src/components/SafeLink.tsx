import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * A wrapper around Next.js Link component that prevents path duplication
 * with basePath on GitHub Pages deployments
 */
interface SafeLinkProps {
  href: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export default function SafeLink({ href, className, children, onClick }: SafeLinkProps) {
  // Next.js Link automatically applies basePath from next.config.js
  // We just need to ensure the path doesn't already have /reNamerX/
  
  // Clean the href by removing any explicit basePath
  const cleanHref = href
    .replace(/^\/reNamerX\//, '/') // Remove /reNamerX/ prefix if present
    .replace(/^reNamerX\//, '/') // Also handle without leading slash
  
  return (
    <Link 
      href={cleanHref}
      className={className} 
      onClick={onClick}
      prefetch={false} // Disable prefetching to prevent path doubling issues
    >
      {children}
    </Link>
  )
} 