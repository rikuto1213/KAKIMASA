/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  typescript: {
    tsconfigPath: 'tsconfig.next.json',
  },
  // Allow usage with Expo
  turbopack: {
    resolveAlias: {
      '@/*': './*',
      '@/lib/*': './lib/*',
      '@/prisma/*': './prisma/*',
    },
  },
};

module.exports = nextConfig;
