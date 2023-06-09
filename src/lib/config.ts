import { IconType } from "react-icons";
import { AuthType } from "./authorize";

// TODO refactor and seperatre into multiple files

// todo is there a better way to do this?
import userConfig from "@/../contribunator.config";
import testConfig from "@/../test/configs/contribunator.config";
import { TailwindColor } from "./tailwindColors";

const appConfig = testConfig || userConfig;

type InheritedSettings = {
  owner: string;
  base: string;
  branchPrefix: string;
  prPostfix: string;
};

type CommonFields = {
  title: string;
  description: string;
};

type RepoConfig = Partial<InheritedSettings> &
  CommonFields & {
    contributions: { [key: string]: Contribution };
  };

type BaseConfig = CommonFields &
  InheritedSettings & {
    authorization: AuthType[];
    repos: {
      [key: string]: RepoConfig;
    };
  };

export type AppConfig = Partial<BaseConfig>;

type UseFiles =
  | { [key: string]: string }
  | ((values: any) => { [key: string]: string });

export type ContributionConfig = {
  type: string;
  color?: TailwindColor;
  options?: { [key: string]: any }; // TODO type specific options
  icon?: IconType;
  useFiles?: UseFiles; // server and client
  useFilesOnClient?: UseFiles; // client only
  useFilesOnServer?: UseFiles; // server only
};

export type Contribution = CommonFields &
  ContributionConfig & {
    schema: any;
    prMetadata: (todo?: any) => { title: string; message: string };
  };

export type Repo = RepoConfig &
  Omit<BaseConfig, "repos"> & {
    githubUrl: string;
    name: string;
  };

export type Config = BaseConfig & {
  repos: { [key: string]: Repo };
};

const defaultConfig: BaseConfig = {
  authorization: ["github", "captcha"],
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

const mergedConfig: BaseConfig = {
  ...defaultConfig,
  ...appConfig,
};

const config: Config = {
  ...mergedConfig,
  repos: Object.entries(mergedConfig.repos).reduce(
    (o, [key, value]) => ({
      ...o,
      [key]: {
        ...value,
        branchPrefix: mergedConfig.branchPrefix,
        base: mergedConfig.base,
        owner: mergedConfig.owner,
        prPostfix: mergedConfig.prPostfix,
        name: key,
        githubUrl: `https://github.com/${mergedConfig.owner}/${key}`,
      },
    }),
    {}
  ),
};

export type ConfigWithRepo = Omit<Config, "repos"> & { repo: Repo };

export function getRepo(repoName: string): ConfigWithRepo {
  if (!repoName) throw new Error("Repo name required");
  const repo = config.repos[repoName];
  if (!repo) throw new Error(`Repository ${repoName} not found`);
  const { repos, ...noReposConfig } = config;
  return { ...noReposConfig, repo };
}

export type ConfigWithContribution = Omit<ConfigWithRepo, "repo"> & {
  repo: Omit<ConfigWithRepo["repo"], "contributions">;
  contribution: Contribution;
};

export function getContribution(
  repoName: string,
  contributionName: string
): ConfigWithContribution {
  if (!contributionName) throw new Error("Contribution name required");
  const config = getRepo(repoName);
  const contribution = config.repo.contributions[contributionName];
  if (!contribution)
    throw new Error(`Contribution ${contributionName} not found`);
  const { contributions, ...noContributionsRepoConfig } = config.repo;
  return { ...config, repo: noContributionsRepoConfig, contribution };
}

export default config;
