import { Html, Head, Main, NextScript } from 'next/document'
import { getBasePath } from '@/utils/paths'

export default function Document() {
  // Get the basePath for GitHub Pages
  const basePath = getBasePath();
  
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Ensure the font paths include the basePath */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Custom font definitions */
          @font-face {
            font-family: 'Modern Girl';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('${basePath}/fonts/modern-girl-font/ModernGirl-rg9Wx.ttf') format('truetype');
          }
          
          @font-face {
            font-family: 'Modern Girl';
            font-style: italic;
            font-weight: 400;
            font-display: swap;
            src: url('${basePath}/fonts/modern-girl-font/ModernGirl-rg9Wx.ttf') format('truetype');
          }
          
          @font-face {
            font-family: 'Wilma Mankiller Modern';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('${basePath}/fonts/wilma-mankiller-modern-font/WilmaMankillerModern-J4Ej.ttf') format('truetype');
          }
          
          @font-face {
            font-family: 'Wilma Mankiller Modern';
            font-style: italic;
            font-weight: 400;
            font-display: swap;
            src: url('${basePath}/fonts/wilma-mankiller-modern-font/WilmaMankillerModern-J4Ej.ttf') format('truetype');
          }
        `}} />
      </Head>
      <body className="bg-background text-text-primary antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set base path for assets
              window.basePath = "${basePath}";
              
              // Fix any absolute paths to include basePath
              document.addEventListener('DOMContentLoaded', function() {
                // Fix background images
                const heroElements = document.querySelectorAll('.bg-hero-pattern');
                heroElements.forEach(el => {
                  const style = getComputedStyle(el);
                  let bgImage = style.backgroundImage;
                  if (bgImage && bgImage.includes('/images/')) {
                    bgImage = bgImage.replace(/url\\(['"]?\\/images\\//g, 'url(' + window.basePath + '/images/');
                    el.style.backgroundImage = bgImage;
                  }
                });
                
                // Log for debugging
                console.log('[Document] Initialized with basePath:', window.basePath);
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