// TODO optimize client/server payloads

import memoize from "lodash/memoize";

import userConfig from "@/../contribunator.config";

// uncomment to enable hot reload during tests development
// import "@/../test/configs/test.config";

import {
  Config,
  ConfigWithContribution,
  ConfigWithRepo,
  UserConfig,
} from "@/types";

// TODO validation
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

async function getUserConfig() {
  if (e2e) {
    return (await import("../../test/configs/test.config")).default;
  }
  if (demo) {
    return (await import("../../test/configs/demo.config")).default;
  }
  return userConfig;
}

// exported for testing
export async function buildConfig(
  userConfig: UserConfig,
  repoName?: string,
  contributionName?: string
) {
  const { repos = {}, ...mainConfig } = userConfig;

  const config: any = {
    ...DEFAULTS,
    ...mainConfig,
    repos: {},
  };

  // inherit and decorate the repo configs
  Object.entries(repos).forEach(([name, repo]) => {
    const merged = { ...config, ...repo };
    config.repos[name] = {
      ...merged,
      name,
      githubUrl: `https://github.com/${merged.owner}/${name}`,
    };
  });

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

async function getConfig(): Promise<Config>;
async function getConfig(repo: string): Promise<ConfigWithRepo>;
async function getConfig(
  repo: string,
  contribution: string
): Promise<ConfigWithContribution>;
async function getConfig(repoName?: string, contributionName?: string) {
  // todo option to pass config for testing
  const userConfig = await getUserConfig();
  return buildConfig(userConfig, repoName, contributionName);
  // validate - todo this should be done each step instead of at the end
  // validate(config);
  // return config;
}

export default memoize(getConfig, (...args) => JSON.stringify(args));
