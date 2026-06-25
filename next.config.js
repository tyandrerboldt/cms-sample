/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pescaemordomia.com',
        pathname: '**',
      },
    ],
    unoptimized: true 
  },
  output: 'standalone', // Enable standalone output
};

module.exports = nextConfig;
