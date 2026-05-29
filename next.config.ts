import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.ausmalbilder-gratis.com',
      },
      {
        protocol: 'https',
        hostname: 'ausmalbilder-gratis-assets.s3.fr-par.scw.cloud',
      },
    ],
  },
};

export default nextConfig;
