import type {
  Config,
  ConfigBase,
  ConfigWithContribution,
  ConfigWithRepo,
} from "@/types";

import { validate } from "./env";

// // TODO figure out a better way to do this
// import userConfig from "@/../contribunator.config";
import getTestConfig from "@/../test/configs/contribunator.config";

// build the config
const baseConfig: ConfigBase = {
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

// TODO: this is a really stupid hack, fix it
let config = baseConfig;
const { repos, ...userConfig } = getTestConfig();
config = { ...baseConfig, ...userConfig };
const mergedConfig = { ...config, ...getTestConfig() };

config = {
  ...mergedConfig,
  repos: Object.entries(mergedConfig.repos).reduce(
    (o, [key, value]) => ({
      ...o,
      [key]: {
        ...value,
        name: key,
        branchPrefix: mergedConfig.branchPrefix,
        base: mergedConfig.base,
        owner: mergedConfig.owner,
        prPostfix: mergedConfig.prPostfix,
        githubUrl: `https://github.com/${mergedConfig.owner}/${key}`,
      },
    }),
    {}
  ),
};

validate(config as Config);

export function getConfig() {
  return config as Config;
}

export function getRepo(repoName: string): ConfigWithRepo {
  if (!repoName) throw new Error("Repository name required");
  const config = getConfig();
  const repo = config.repos[repoName];
  if (!repo) throw new Error(`Repository ${repoName} not found`);
  const { repos, ...configNoRepos } = config;
  return { ...configNoRepos, repo };
}

export function getContribution(
  repoName: string,
  contributionName: string
): ConfigWithContribution {
  if (!contributionName) throw new Error("Contribution name required");
  const config = getRepo(repoName);
  const contribution = config.repo.contributions[contributionName];
  if (!contribution)
    throw new Error(`Contribution ${contributionName} not found`);
  const { contributions, ...repo } = config.repo;
  return { ...config, repo, contribution };
}
