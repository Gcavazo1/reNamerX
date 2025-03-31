/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Always include trailing slashes for consistent paths
  trailingSlash: true,
  
  // Static image handling
  images: {
    unoptimized: true,
  },
  
  // GitHub Pages deployment settings
  basePath: process.env.NODE_ENV === 'production' ? '/reNamerX' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/reNamerX' : '',
  
  // Static HTML export
  output: 'export',
}

module.exports = nextConfig 