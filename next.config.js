/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/royal-coffee' : '',
  assetPrefix: isProd ? '/royal-coffee/' : '',
}

module.exports = nextConfig