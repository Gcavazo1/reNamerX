/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Always include trailing slashes for consistent paths
  trailingSlash: true,
  
  // Static image handling
  images: {
    unoptimized: true,
  },
  
  // Deployment settings - HARDCODE for GitHub Pages
  // Don't use conditional here because it causes inconsistency at runtime
  basePath: '/reNamerX',
  assetPrefix: '/reNamerX/',
  
  // Static HTML export (only needed for GitHub Pages, Vercel handles this automatically)
  output: 'export',
}

module.exports = nextConfig 