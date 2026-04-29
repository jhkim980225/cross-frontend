/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8945";

const nextConfig = {
  // /api/* 요청을 백엔드로 프록시 → 브라우저 CORS 우회
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  // 동적 라우트 클라이언트 캐시 비활성화 — searchParams 변경 시 즉시 서버 재요청
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  images: {
    remotePatterns: [
      { hostname: "*.bunjang.co.kr" },
      { hostname: "*.daangn.com" },
      { hostname: "*.gcp-karroter.net" },
      { hostname: "*.cloudfront.net" },
      { hostname: "*.joongna.com" },
      { hostname: "*.joonggonara.co.kr" },
      { hostname: "cafe.pstatic.net" },
      { hostname: "*.hellomarket.com" },
      { hostname: "*.vinted.net" },
    ],
  },
};

export default nextConfig;
