const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin monorepo/workspace root so Turbopack doesn't pick up a parent package-lock.json (e.g. under the user home dir).
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tile.openstreetmap.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openstreetmap.org',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
