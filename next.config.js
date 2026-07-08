/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'connectautosales.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
