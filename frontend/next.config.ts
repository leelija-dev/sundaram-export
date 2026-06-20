import type { NextConfig } from "next";

function buildMediaRemotePatterns() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";
  const mediaOrigin = process.env.NEXT_PUBLIC_MEDIA_ORIGIN ?? apiUrl.replace(/\/api\/v1\/?$/, "");

  try {
    const origin = new URL(mediaOrigin);
    const protocol = origin.protocol.replace(":", "") as "http" | "https";
    patterns.push({
      protocol,
      hostname: origin.hostname,
      ...(origin.port ? { port: origin.port } : {}),
      pathname: "/media/**",
    });
  } catch {
    patterns.push(
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    );
  }

  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  images: {
    remotePatterns: buildMediaRemotePatterns(),
  },
  turbopack: {
    // process.cwd() avoids import.meta, which breaks when Next compiles config to CJS
    root: process.cwd(),
  },
};

export default nextConfig;
