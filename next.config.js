const { edges } = require('slate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `falsenotescontent.file.core.windows.net`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `falsenotescontent.blob.core.windows.net`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'http',
        hostname: `cdn.falsenotes.dev`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `falsenotes.dev`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `avatars.githubusercontent.com`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `unsplash.com`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `images.unsplash.com`,
        port: '',
        pathname: `/**`,
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/beta',
        destination: 'https://beta.falsenotes.dev/',
        permanent: false,
      },
      {
        source: '/github',
        destination: 'https://github.com/falsenotes-dev/',
        permanent: false,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/falsenotesteam/',
        permanent: false,
      },
      {
        source: '/instagram',
        destination: 'https://instagram.com/falsenotes.dev/',
        permanent: false,
      }
    ]
  },
  env: {
    DOMAIN: process.env.DOMAIN,
  }
};

module.exports = {
  ...nextConfig
};