import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Regex to check for duplicate repository name in the path
const DUPLICATE_PATH_REGEX = /^\/reNamerX\/reNamerX\//

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Log the current pathname for debugging
  console.log('Middleware intercepted path:', pathname)

  // Check if this is a duplicate path (contains /reNamerX/reNamerX/)
  if (DUPLICATE_PATH_REGEX.test(pathname)) {
    // Fix the path by removing the duplicate repo name
    const correctedPath = pathname.replace('/reNamerX/reNamerX/', '/reNamerX/')
    console.log('Correcting duplicate path to:', correctedPath)
    
    // Create a new URL with the correct path
    const url = request.nextUrl.clone()
    url.pathname = correctedPath
    
    // Redirect to the corrected URL
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which paths this middleware applies to
export const config = {
  matcher: [
    // Apply to all paths except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
} 