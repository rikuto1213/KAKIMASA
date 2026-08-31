/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expo web compatibility
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Allow usage with Expo
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
