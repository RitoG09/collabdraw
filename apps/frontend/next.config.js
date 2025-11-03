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
  // Remove the webpack config section
};

export default nextConfig;
