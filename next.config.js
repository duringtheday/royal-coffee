/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.GITHUB_PAGES === 'true' ? '/royal-coffee' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/royal-coffee/' : '',
}

module.exports = nextConfig