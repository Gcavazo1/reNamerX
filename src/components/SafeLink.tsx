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
  
  // Simple path cleaning to ensure relative paths
  // Remove leading and duplicate slashes, and strip any "/reNamerX" prefix
  const cleanPath = href
    .replace(/^\//, '')  // Remove leading slash 
    .replace(/^reNamerX\//, '')  // Remove reNamerX/ prefix if present
  
  // Use the withBasePath utility to prepend the base path properly
  // This makes all links relative to the base path
  const basePath = '/reNamerX'
  const finalHref = `${basePath}/${cleanPath}`
  
  return (
    <Link 
      href={finalHref} 
      className={className} 
      onClick={onClick}
    >
      {children}
    </Link>
  )
} 