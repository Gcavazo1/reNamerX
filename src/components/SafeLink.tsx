import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { withBasePath } from '@/utils/paths'

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
  const router = useRouter()
  
  // Clean any potential duplicate basePath
  const basePathPattern = /^\/reNamerX\/reNamerX(\/|$)/i
  const cleanedHref = href.replace(basePathPattern, '/reNamerX$1')
  
  // Use our withBasePath function to ensure correct path
  const finalHref = withBasePath(cleanedHref)
  
  // Log the href transformation for debugging
  if (typeof window !== 'undefined' && href !== finalHref) {
    console.log(`[SafeLink] Transformed href: ${href} → ${finalHref}`)
  }
  
  return (
    <Link 
      href={finalHref} 
      className={className} 
      onClick={(e) => {
        if (onClick) onClick()
        
        // Extra safety - if path is duplicated, cancel navigation and fix manually
        if (finalHref.includes('/reNamerX/reNamerX/')) {
          e.preventDefault()
          console.warn('[SafeLink] Prevented navigation to duplicate path:', finalHref)
          const correctedPath = finalHref.replace('/reNamerX/reNamerX/', '/reNamerX/')
          router.push(correctedPath)
          return false
        }
      }}
    >
      {children}
    </Link>
  )
} 