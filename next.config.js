/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Always include trailing slashes for consistent paths
  trailingSlash: true,
  
  // Static image handling
  images: {
    unoptimized: true,
  },
  
  // Deployment settings
  // Use conditional configuration based on deployment target
  basePath: process.env.GITHUB_PAGES === 'true' ? '/reNamerX' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/reNamerX' : '',
  
  // Static HTML export (only needed for GitHub Pages, Vercel handles this automatically)
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
}

module.exports = nextConfig 