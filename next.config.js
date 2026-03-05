/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  ...(isGithubPages && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? '/royal-coffee' : '',
  assetPrefix: isGithubPages ? '/royal-coffee/' : '',
}

module.exports = nextConfig