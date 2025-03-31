import { Html, Head, Main, NextScript } from 'next/document'
import { getBasePath, isGitHubPages } from '@/utils/paths'

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
      </Head>
      <body className="bg-background text-text-primary antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set base path for background images
              document.addEventListener('DOMContentLoaded', function() {
                var styleSheet = document.createElement('style');
                styleSheet.textContent = '.bg-hero-pattern { background-image: url("${basePath}/images/reNamerX_heroBackground.png") !important; }';
                document.head.appendChild(styleSheet);
              });
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 