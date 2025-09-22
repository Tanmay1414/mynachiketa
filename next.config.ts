/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ❌ Skip ESLint errors during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
