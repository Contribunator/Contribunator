const nextConfig = {
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  env: {
    userTestConfig: require("fs").existsSync(
      "contributions/test/configs/test.config.ts"
    ),
  },
};

function getConfig() {
  if (process.env.ANALYZE === "true") {
    return require("@next/bundle-analyzer")({ enabled: true })(nextConfig);
  }
  if (process.env.LOGTAIL_SOURCE_TOKEN) {
    return require("@logtail/next").withLogtail(nextConfig);
  }
  return nextConfig;
}

module.exports = getConfig();
