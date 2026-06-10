import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // process.cwd() avoids import.meta, which breaks when Next compiles config to CJS
    root: process.cwd(),
  },
};

export default nextConfig;
