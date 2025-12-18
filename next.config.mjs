// // next.config.mjs
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverExternalPackages: ["ssh2"],
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move it here, to the top level
  serverExternalPackages: ["ssh2"],
  
  // Keep experimental empty or remove it if you don't need other flags
  experimental: {}, 
};

export default nextConfig;