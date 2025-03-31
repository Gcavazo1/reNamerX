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
      </Head>
      <body className="bg-background text-text-primary antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set base path for assets
              window.basePath = "${basePath}";
              
              // Set CSS variable for base path to make font loading work
              document.documentElement.style.setProperty('--base-path', '${basePath}');
              
              // Also fix background images that use Tailwind's backgroundImage
              document.addEventListener('DOMContentLoaded', function() {
                const heroElements = document.querySelectorAll('.bg-hero-pattern');
                heroElements.forEach(el => {
                  const style = getComputedStyle(el);
                  let bgImage = style.backgroundImage;
                  if (bgImage && bgImage.includes('/images/')) {
                    bgImage = bgImage.replace(/url\\(['"]?\\/images\\//g, 'url(' + window.basePath + '/images/');
                    el.style.backgroundImage = bgImage;
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