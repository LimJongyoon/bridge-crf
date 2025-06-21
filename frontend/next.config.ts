/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 중요!
  trailingSlash: true, // 폴더형 URL 필수
  images: {
    unoptimized: true, // 이미지 최적화 제거
  },
  //basePath: "./", // 상대 경로 유지
};

export default nextConfig;
