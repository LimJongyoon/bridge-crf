import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: '/bridge-crf',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
