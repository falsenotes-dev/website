const { edges } = require("slate");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `falsenotescontent.file.core.windows.net`,
        port: "",
        pathname: `/**`,
      },
      {
        protocol: "https",
        hostname: `ltord0pu249uzgxe.public.blob.vercel-storage.com`,
        port: "",
        pathname: `/**`,
      },
      {
        protocol: "https",
        hostname: `falsenotescontent.blob.core.windows.net`,
        port: "",
        pathname: `/**`,
      },
      {
        protocol: "http",
        hostname: `cdn.falsenotes.dev`,
        port: "",
        pathname: `/**`,
      },
      {
        protocol: "https",
        hostname: `falsenotes.dev`,
        port: "",
        pathname: `/**`,
      },
      {
        protocol: "https",
        hostname: `avatars.githubusercontent.com`,
        port: "",
        pathname: `/**`,
      },
      {
        protocol: "https",
        hostname: `unsplash.com`,
        port: "",
        pathname: `/**`,
      },
      {
        protocol: "https",
        hostname: `images.unsplash.com`,
        port: "",
        pathname: `/**`,
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/beta",
        destination: "https://beta.falsenotes.dev/",
        basePath: false,
        permanent: true,
      },
      {
        source: "/store",
        destination: "https://store.falsenotes.dev/",
        basePath: false,
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/falsenotes-dev/",
        basePath: false,
        permanent: true,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/falsenotesteam/",
        basePath: false,
        permanent: true,
      },
      {
        source: "/instagram",
        destination: "https://instagram.com/falsenotes.dev/",
        basePath: false,
        permanent: true,
      },
      {
        source: "/donate",
        destination: "https://www.buymeacoffee.com/bkhtdev",
        basePath: false,
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/@falsenotes/terms-of-service",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/@falsenotes/privacy-policy",
        permanent: true,
      },
    ];
  },
  env: {
    DOMAIN: process.env.DOMAIN,
  },
};

module.exports = {
  ...nextConfig,
};
