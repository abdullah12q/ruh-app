/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.qurancdn.com",
      },
      {
        protocol: "https",
        hostname: "verses.quran.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Allow audio streaming from mp3quran.net CDN servers (server6–server16, etc.)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
  // dah 3shan ageb el location mn https://nominatim.openstreetmap.org
  async rewrites() {
    return [
      {
        source: "/osm-api/:path*",
        destination: "https://nominatim.openstreetmap.org/:path*",
      },
    ];
  },
};

export default nextConfig;
