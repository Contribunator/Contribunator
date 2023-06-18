import type {
  Config,
  ConfigBase,
  ConfigWithContribution,
  ConfigWithRepo,
} from "@/types";

import { validate } from "./env";

import testConfig from "@/../test/configs/test.config";
import userConfig from "@/../contribunator.config";

const appConfig = testConfig || userConfig;

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
};

const { repos = {}, ...mainConfig } = appConfig;
const config: Config = { ...baseConfig, ...mainConfig, repos: {} };

config.repos = Object.entries(repos).reduce(
  (r, [name, repo]) => ({
    ...r,
    [name]: {
      branchPrefix: config.branchPrefix,
      base: config.base,
      owner: config.owner,
      prPostfix: config.prPostfix,
      ...repo,
      name,
      githubUrl: `https://github.com/${config.owner}/${name}`,
      contributions: Object.entries(repo.contributions).reduce(
        (o, [key, value]) => ({ ...o, [key]: value(config) }),
        {}
      ),
    },
  }),
  {}
);

validate(config);

export function getRepo(repoName: string): ConfigWithRepo {
  if (!repoName) throw new Error("Repository name required");
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

export default config;
