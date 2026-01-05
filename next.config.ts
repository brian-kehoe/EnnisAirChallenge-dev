import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from devices on local network during development
  allowedDevOrigins: ['192.168.1.128'],
};

export default nextConfig;
