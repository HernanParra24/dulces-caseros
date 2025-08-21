/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  trailingSlash: false,
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
}

module.exports = nextConfig
