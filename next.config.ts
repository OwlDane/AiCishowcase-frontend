import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'aici-umg.com',
        pathname: '**',
      },
    ],
  },
  experimental: {
    // @ts-ignore
    allowedDevOrigins: ['10.10.227.54'],
  },
};

export default nextConfig;
