import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  output: 'export',  // 启用静态导出模式
  images: {
    unoptimized: true  // 禁用图片优化
  }
}