import { Config, ConfigWithContribution, ConfigWithRepo, Repo } from "@/types";

import { demo, e2e, validate } from "./env";

import { memoize } from "lodash";

// TODO allow loading various different config files
async function getUserConfig() {
  if (e2e || demo) {
    return import("@/../test/configs/test.config");
  }
  return import("@/../contribunator.config");
}

// TODO optimize this so that we only initialize the required contributions?
// TODO optimize client/server payloads
const buildConfig = memoize(async function () {
  const { default: userConfig } = await getUserConfig();
  // build the config
  const { repos = {}, ...mainConfig } = userConfig;

  const config: Config = {
    authorization: ["github"],
    title: "Contribunator",
    description:
      "Effortlessly contribute to GitHub! No coding or GitHub experience needed. Simply fill out a form, submit, and you're done. Contributing has never been easier!",
    owner: "Contribunator",
    branchPrefix: "c11r/",
    base: "main",
    prPostfix:
      "\n\n---\n*Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*",
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
  const config = await buildConfig();

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

export default getConfig;
