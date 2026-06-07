/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "server.arcgisonline.com" },
      { protocol: "https", hostname: "*.tile.openstreetmap.org" },
    ],
  },
};

export default nextConfig;
