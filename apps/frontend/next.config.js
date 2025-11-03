// import path from "path";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: { ignoreDuringBuilds: true },
//   typescript: { ignoreBuildErrors: true },
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "images.unsplash.com" },
//       { protocol: "https", hostname: "html.tailus.io" },
//     ],
//   },
//   transpilePackages: ["@repo/common", "@repo/ui", "@repo/db", "@repo/kafka"],
//   reactStrictMode: true,
// };

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "html.tailus.io" },
    ],
  },
  transpilePackages: ["@repo/common", "@repo/db", "@repo/kafka"],
  reactStrictMode: true,

  webpack: (config) => {
    // Follow symlinks
    config.resolve.symlinks = true;

    // Explicitly set alias for @repo/common
    config.resolve.alias["@repo/common"] = path.resolve(
      __dirname,
      "../../packages/common/src/types.ts"
    );

    return config;
  },

  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
