/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Always include trailing slashes for consistent paths
  trailingSlash: true,
  
  // Static image handling
  images: {
    unoptimized: true,
  },
}

// Add GitHub Pages specific configuration only when deploying to GitHub Pages
if (process.env.GITHUB_PAGES === 'true') {
  nextConfig.basePath = '/reNamerX';
  nextConfig.assetPrefix = '/reNamerX/';
  nextConfig.output = 'export';
}

module.exports = nextConfig 