/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["ssh2"],
  },
};

export default nextConfig;
