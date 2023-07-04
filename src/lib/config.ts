import memoize from "lodash/memoize";

// uncomment to enable hot reload during tests development
// import "@/../test/configs/test.config";

import type { Config, ConfigWithContribution, ConfigWithRepo } from "@/types";

import { demo, e2e, isServer } from "@/lib/env";
import buildConfig from "@/lib/helpers/buildConfig";

async function resolveConfig() {
  if (e2e) {
    return await import("@/../test/configs/core.test.config");
  } else if (demo) {
    return await import("@/../test/configs/demo.config");
  }
  return await import("@/../contribunator.config");
}

const getUserConfig = memoize(async function () {
  const userConfigModule = await resolveConfig();
  const userConfig =
    typeof userConfigModule.default === "function"
      ? await userConfigModule.default()
      : userConfigModule.default;
  const config = buildConfig(userConfig);
  if (isServer) {
    (await import("@/lib/env.server")).validateEnv(config);
  }
  return config;
});

async function getConfig(): Promise<Config>;
async function getConfig(repo: string): Promise<ConfigWithRepo>;
async function getConfig(
  repo: string,
  contribution: string
): Promise<ConfigWithContribution>;
async function getConfig(repoName?: string, contributionName?: string) {
  // get the resolved and transformed conffig
  const config = await getUserConfig();
  // that's all we need if no repo is passed
  if (!repoName) {
    return config as Config;
  }
  // check we have the repo
  if (!config.repos[repoName])
    throw new Error(`Repository ${repoName} not found`);
  // pass the repo
  const repo = config.repos[repoName];
  // this is all we need to do if no contribution is passed
  if (!contributionName) {
    return { ...config, repo } as ConfigWithRepo;
  }

  // check we have the contribution
  if (!repo.contributions[contributionName]) {
    throw new Error(`Contribution ${contributionName} not found`);
  }
  // load the contribution
  // TODO we should memomize this instead of the whole function?
  const { load } = repo.contributions[contributionName];
  const contribution = await load(contributionName, repo);
  return { ...config, repo, contribution } as ConfigWithContribution;
}

export default memoize(getConfig, (...args) => JSON.stringify(args));
