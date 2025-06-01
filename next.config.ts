import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: '/bridge-crf',
  assetPrefix: '/bridge-crf', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
