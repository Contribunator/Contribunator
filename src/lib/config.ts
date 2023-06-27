import memoize from "lodash/memoize";

// uncomment to enable hot reload during tests development
// import "@/../test/configs/test.config";

import {
  Config,
  ConfigWithContribution,
  ConfigWithRepo,
  UserConfig,
} from "@/types";

import { demo, e2e, isServer } from "@/lib/env";

export const DEFAULTS: Config = {
  authorization: ["github"],
  title: "Contribunator",
  description:
    "Effortlessly contribute to GitHub! No coding or GitHub experience needed. Simply fill out a form, submit, and you're done. Contributing has never been easier!",
  owner: "Contribunator",
  branchPrefix: "c11r/",
  base: "main",
  prPostfix:
    "\n\n---\n*Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*",
  repos: {},
};

async function resolveConfig() {
  if (e2e) {
    return (await import("@/../test/configs/test.config")).default;
  } else if (demo) {
    return (await import("@/../test/configs/demo.config")).default;
  }
  return (await import("@/../contribunator.config")).default;
}

// inherit and decorate the repo configs, exported for testing
export function buildConfig(userConfig: UserConfig): Config {
  const { repos = {}, ...mainConfig } = userConfig;
  const config: any = {
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

const getUserConfig = memoize(async function () {
  const userConfig = await resolveConfig();
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
  const { load } = repo.contributions[contributionName];
  const contribution = await load(contributionName, repo);
  return { ...config, repo, contribution } as ConfigWithContribution;
}

export default memoize(getConfig, (...args) => JSON.stringify(args));
