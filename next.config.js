/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  i18n,
  images: {
    remotePatterns: [
      {
        hostname: 'godot4games.com'
      },
      {
        hostname: 'gas-wgames.vercel.app'
      },
      {
        hostname: 'img.youtube.com'
      },
      {
        hostname: 'localhost'
      },
      {
        hostname: 'devmaster.team'
      },
      {
        hostname: 'matrix-reliability.eu'
      },
      {
        hostname: '127.0.0.1',
        port: '8000'
      },
      {
        hostname: 'maps.googleapis.com'
      },
      {
        hostname: 's3.amazonaws.com'
      },
      {
        hostname: 'godot-asset-store.s3.eu-central-1.amazonaws.com'
      },
      {
        hostname: 'dev-godot-asset-store.s3.eu-central-1.amazonaws.com'
      }
    ]
  },
  ...(process.env.APPLICATION_BUILD_MODE === 'production' && {
    typescript: {
      ignoreBuildErrors: true
    },
    eslint: {
      ignoreDuringBuilds: true
    }
  })
}
