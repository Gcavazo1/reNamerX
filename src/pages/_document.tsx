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
        
        {/* Font definitions with basePath for both platforms */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --base-path: '${basePath}';
          }
          
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
          
          /* Override Tailwind hero background image path for GitHub Pages */
          .bg-hero-pattern {
            background-image: url('${basePath}/images/reNamerX_heroBackground.png') !important;
          }
        `}} />
      </Head>
      <body className="bg-background text-text-primary antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set base path for assets
              window.basePath = "${basePath}";
              
              // Make sure all assets use the correct base path
              document.addEventListener('DOMContentLoaded', function() {
                // Fix any additional background images that might be loaded
                const bgElements = document.querySelectorAll('[style*="background-image"]');
                bgElements.forEach(el => {
                  const style = getComputedStyle(el);
                  let bgImage = style.backgroundImage;
                  if (bgImage && bgImage.includes('/images/') && !bgImage.includes(window.basePath)) {
                    bgImage = bgImage.replace(/url\\(['"]?\\/images\\//g, 'url(' + window.basePath + '/images/');
                    el.style.backgroundImage = bgImage;
                  }
                });
                
                // Fix any image src attributes
                const imgElements = document.querySelectorAll('img[src^="/images/"]');
                imgElements.forEach(el => {
                  if (!el.src.includes(window.basePath)) {
                    el.src = window.basePath + el.getAttribute('src');
                  }
                });
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