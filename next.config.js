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
  async headers() {
    const noBrowserHtmlCache = {
      key: 'Cache-Control',
      value: 'public, max-age=0, s-maxage=0, must-revalidate',
    };

    return [
      {
        source: '/pacotes/:path*',
        headers: [noBrowserHtmlCache],
      },
      {
        source: '/blog/:path*',
        headers: [noBrowserHtmlCache],
      },
    ];
  },
};

module.exports = nextConfig;
