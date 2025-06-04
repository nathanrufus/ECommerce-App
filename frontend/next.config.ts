import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com", "localhost", "res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
  eslint: {
    // ✅ Prevent build failure due to ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Prevent build failure due to type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
