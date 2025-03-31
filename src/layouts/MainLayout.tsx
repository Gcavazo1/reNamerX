import React, { ReactNode } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getBasePath, getFullUrl } from '@/utils/paths'

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
}

const MainLayout = ({ 
  children, 
  title = 'reNamerX - Powerful File Batch Renaming Tool', 
  description = 'reNamerX is a powerful desktop application for batch renaming files with an intuitive interface and advanced features.' 
}: MainLayoutProps) => {
  const router = useRouter()
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href={`${getBasePath()}/images/renamerx_favicon_image.png`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getFullUrl(router.asPath)} />
        <meta property="og:image" content={`${getBasePath()}/images/renamerx-screenshot.jpg`} />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </>
  )
}

export default MainLayout 