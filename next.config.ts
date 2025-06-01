// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: isProd ? '/bridge-crf' : '',
  assetPrefix: isProd ? '/bridge-crf' : '', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
