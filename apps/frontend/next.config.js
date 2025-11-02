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

// export default nextConfig;

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
  transpilePackages: ["@repo/common", "@repo/ui", "@repo/db", "@repo/kafka"],
  reactStrictMode: true,

  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, ".");
    // Support baseUrl-style imports by adding root to modules resolution
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "."),
    ];
    return config;
  },
};

export default nextConfig;
