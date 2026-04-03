import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.ausmalbilder-gratis.com',
      },
    ],
  },
};

export default nextConfig;
