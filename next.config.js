/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vmi2293141.contaboserver.net',
        pathname: '**',
      },
    ],
    unoptimized: true 
  },
  output: 'standalone', // Enable standalone output
};

module.exports = nextConfig;