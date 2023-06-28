/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
