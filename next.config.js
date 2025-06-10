/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // WARNING: This disables ESLint during builds
    // Only use this temporarily for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig