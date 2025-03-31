import { Html, Head, Main, NextScript } from 'next/document'
import { getBasePath } from '@/utils/paths'

export default function Document() {
  const basePath = getBasePath();
  
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Simple font definitions - no fancy handling */}
        <link rel="stylesheet" href={`${basePath}/fonts/fonts.css`} />
        
        {/* Fix for hero background image */}
        <style dangerouslySetInnerHTML={{ __html: `
          .bg-hero-pattern {
            background-image: url('${basePath}/images/reNamerX_heroBackground.png') !important;
          }
        `}} />
      </Head>
      <body className="bg-background text-text-primary antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 