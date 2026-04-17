/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "*.bunjang.co.kr" },
      { hostname: "*.daangn.com" },
      { hostname: "*.gcp-karroter.net" },
      { hostname: "*.joongna.com" },
      { hostname: "*.joonggonara.co.kr" },
      { hostname: "cafe.pstatic.net" },
      { hostname: "*.hellomarket.com" },
      { hostname: "*.vinted.net" },
    ],
  },
};

export default nextConfig;
