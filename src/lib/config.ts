// TODO optimize this so that we only fetch required contributions?
// TODO optimize client/server payloads

import { memoize } from "lodash";

import userConfig from "@/../contribunator.config";

// uncomment to enable hot reload during tests development
// import "@/../test/configs/test.config";

import {
  Config,
  ConfigWithContribution,
  ConfigWithRepo,
  Repo,
  UserConfig,
} from "@/types";

import { demo, e2e, validate } from "./env";

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

// exported for testing
export function buildConfig(userConfig: UserConfig): Config {
  const { repos = {}, ...mainConfig } = userConfig;

  const config: Config = {
    ...DEFAULTS,
    ...mainConfig,
    repos: {},
  };
  // populate repos
  Object.entries(repos).forEach(
    ([repoName, { contributions, ...repoConfig }]) => {
      const { repos, ...inheritedConfig } = config;
      const merged = { ...inheritedConfig, ...repoConfig };
      const repo: Repo = {
        ...merged,
        name: repoName,
        githubUrl: `https://github.com/${merged.owner}/${repoName}`,
        contributions: {},
      };
      // populate repo's contributions (pass repo config for schema init)
      Object.entries(contributions).forEach(
        ([contributionName, contribution]) => {
          // initialize the contribution; builds schema, etc.
          repo.contributions[contributionName] = contribution(
            contributionName,
            repo
          );
        }
      );
      config.repos[repoName] = repo;
    }
  );
  return config;
}

async function getAppConfig() {
  if (e2e) {
    return (await import("@/../test/configs/test.config")).default;
  }
  if (demo) {
    return (await import("@/../test/configs/demo.config")).default;
  }
  return userConfig;
}

const memoizedConfig = memoize(async function () {
  const appConfig = await getAppConfig();
  const config = buildConfig(appConfig);
  validate(config);
  return config;
});

async function getConfig(): Promise<Config>;
async function getConfig(repo: string): Promise<ConfigWithRepo>;
async function getConfig(
  repo: string,
  contribution: string
): Promise<ConfigWithContribution>;
async function getConfig(repo?: string, contribution?: string) {
  const config = await memoizedConfig();
  if (repo) {
    if (!config.repos[repo]) throw new Error(`Repository ${repo} not found`);
    const configWithRepo: ConfigWithRepo = {
      ...config,
      repo: config.repos[repo],
    };
    if (contribution) {
      if (!configWithRepo.repo.contributions[contribution]) {
        throw new Error(`Contribution ${contribution} not found`);
      }
      const configWithContribution: ConfigWithContribution = {
        ...configWithRepo,
        contribution: configWithRepo.repo.contributions[contribution],
      };
      return configWithContribution;
    }
    return configWithRepo;
  }
  return config as Config;
}

export default memoize(getConfig, (...args) => JSON.stringify(args));
