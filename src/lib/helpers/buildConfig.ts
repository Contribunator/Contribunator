// inherit and decorate the repo configs, exported for testing
import type { UserConfig, Config } from "@/types";

import { DEFAULTS } from "@/lib/constants";

export default function buildConfig(userConfig: UserConfig): Config {
  const { repos = {}, ...mainConfig } = userConfig;
  const config: Config = {
    ...DEFAULTS,
    ...mainConfig,
    repos: {},
  };
  Object.entries(repos).forEach(([name, repo]) => {
    const merged = { ...config, ...repo };
    config.repos[name] = {
      ...merged,
      name,
      githubUrl: `https://github.com/${merged.owner}/${name}`,
    };
  });
  return config;
}
