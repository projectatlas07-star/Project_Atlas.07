/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove TypeScript error suppression - fix real errors instead
  transpilePackages: ['@project-atlas/ui'],
};

module.exports = nextConfig;
