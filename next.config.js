/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Always include trailing slashes for consistent paths
  trailingSlash: true,
  
  // Static image handling
  images: {
    unoptimized: true,
  },
  
  // GitHub Pages configuration
  basePath: '/reNamerX',
  assetPrefix: '/reNamerX/',
  
  // Static HTML export for GitHub Pages
  output: 'export',
}

module.exports = nextConfig 