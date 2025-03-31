import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getBasePath, withBasePath, getFullUrl } from '@/utils/paths'

const inter = Inter({ subsets: ['latin'] })

// Google Analytics implementation
const GA_TRACKING_ID = 'G-XXXXXXXXXX' // Replace with your actual Google Analytics tracking ID

// Analytics helper functions
const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  // Handle trailing slashes consistently
  useEffect(() => {
    const path = router.asPath
    // If we have a path without a trailing slash (excluding the homepage)
    if (path !== '/' && !path.endsWith('/')) {
      router.replace(`${path}/`)
    }
  }, [router.asPath, router])

  useEffect(() => {
    // Track page views when routes change
    const handleRouteChange = (url: string) => {
      pageview(url)
    }

    // Add route change event listeners
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    // This script checks if we are being redirected from the 404.html page
    if (typeof window !== 'undefined') {
      // Parse the query string
      const query = window.location.search.substring(1);
      const shouldRedirect = query.includes('?/');

      if (shouldRedirect) {
        // Find the path after ?/
        const redirectPath = query.split('?/')[1];
        console.log('SPA redirect detected to path:', redirectPath);
        
        // Get the repository name from the pathname
        const pathParts = window.location.pathname.split('/');
        const repoPath = pathParts[1] ? '/' + pathParts[1] : '';
        
        // Reconstruct the proper URL
        const cleanUrl = window.location.protocol + '//' + 
                        window.location.host + 
                        repoPath;
        
        // Clean up any double slashes and handle query parameters
        const finalPath = redirectPath
          .replace(/~and~/g, '&')
          .replace(/^\/+/, '');
        
        // Update the browser URL without triggering navigation
        window.history.replaceState(
          null, 
          '', 
          `${cleanUrl}/${finalPath}${window.location.hash}`
        );
        
        // Navigate using Next.js router
        console.log('Navigating to cleaned path:', '/' + finalPath);
        setTimeout(() => {
          router.push('/' + finalPath);
        }, 100);
      }
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>reNamerX - Advanced File Renaming Tool</title>
        <meta name="description" content="reNamerX is a powerful file renaming utility for Windows that helps you rename multiple files quickly and efficiently." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={withBasePath('/images/renamerx_favicon_image.png')} />
        <meta name="theme-color" content="#121212" />
        
        {/* Enhanced SEO Tags */}
        <meta name="keywords" content="file renamer, batch rename, file management, Windows utility, bulk rename" />
        <meta name="author" content="Gabriel Cavazos (GigaCode)" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={getFullUrl('/')} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="reNamerX - Advanced File Renaming Tool" />
        <meta property="og:description" content="Powerful batch file renaming utility for Windows. Rename hundreds of files in seconds with precision and control." />
        <meta property="og:image" content={withBasePath('/images/renamerx-screenshot.jpg')} />
        <meta property="og:url" content={getFullUrl(router.asPath)} />
        <meta property="og:site_name" content="reNamerX" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="reNamerX - Advanced File Renaming Tool" />
        <meta name="twitter:description" content="Powerful batch file renaming utility for Windows. Rename hundreds of files in seconds with precision and control." />
        <meta name="twitter:image" content={withBasePath('/images/renamerx-screenshot.jpg')} />
        <meta name="twitter:creator" content="@GigaCodeDev" />
        
        {/* Structured Data / JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "reNamerX",
              "operatingSystem": "Windows",
              "applicationCategory": "UtilitiesApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "1"
              },
              "description": "A powerful desktop file batch renaming application"
            })
          }}
        />
      </Head>
      
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      
      <Script 
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
        }}
      />
      
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </>
  )
} 