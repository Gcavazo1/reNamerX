import { Html, Head, Main, NextScript } from 'next/document'
import { getBasePath } from '@/utils/paths'

export default function Document() {
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
              window.basePath = "${getBasePath()}";
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 