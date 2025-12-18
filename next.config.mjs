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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // This tells Webpack to ignore these modules and not try to bundle them
      config.externals.push("ssh2", "cpu-features", "nan");
    }
    return config;
  },
  // If the key above still throws a warning, you can try moving this
  // back into experimental just to see if it clears the warning,
  // but the webpack fix above is the "heavy duty" solution.
  experimental: {
    serverExternalPackages: ["ssh2"],
  },
};

export default nextConfig;
