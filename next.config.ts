// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: isProd ? '/bridge-crf' : '',
  assetPrefix: isProd ? '/bridge-crf/' : '', // ✅ 여기 슬래시 꼭!
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
