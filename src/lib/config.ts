import { IconType } from "react-icons";
import { AuthType } from "./authorize";

// todo is there a better way to do this?
import userConfig from "@/../contribunator.config";
import testConfig from "@/../test/test.contribunator.config";

const appConfig = testConfig || userConfig;

// type TailwindColor = "slate" | "gray" | "zinc" | "neutral" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
// TODO add more color options, add to tailwind.config.js, move this elsewhere
export type TailwindColor = "slate" | "blue" | "red";

type InheritedSettings = {
  owner: string;
  base: string;
  branchPrefix: string;
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
    prPostfix: string;
    repos: {
      [key: string]: RepoConfig;
    };
  };

export type AppConfig = Partial<BaseConfig>;

export type Contribution = CommonFields & {
  type: string;
  color?: TailwindColor;
  options?: { [key: string]: any };
  icon?: IconType;
};

export type Repo = RepoConfig &
  Omit<BaseConfig, "repos"> & {
    githubUrl: string;
    name: string;
  };

export type Config = BaseConfig & {
  repos: { [key: string]: Repo };
};

// TODO replace with test config?
// TODO, make user-defined configs easier to use;
// export a method that decorates the config and contrib types

// Have demo config elsewhere
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
        name: key,
        githubUrl: `https://github.com/${mergedConfig.owner}/${key}`,
      },
    }),
    {}
  ),
};

export type ConfigWithRepo = Config & { repo: Repo };
export type ConfigWithContribution = ConfigWithRepo & {
  repo: { contribution: Contribution };
};

// returns relevant config object
export function getConfig(): Config;
export function getConfig(repoName: string): ConfigWithRepo;
export function getConfig(
  repoName: string,
  contributionName: string
): ConfigWithContribution;
export function getConfig(
  repoName?: string,
  contributionName?: string
): Config | ConfigWithRepo | ConfigWithContribution {
  if (!repoName) return config;
  const repo = config.repos[repoName];
  if (!repo) throw new Error(`Repository ${repoName} not found`);
  if (!contributionName) return { ...config, repo };
  const contribution = repo.contributions[contributionName];
  if (!contribution)
    throw new Error(`Contribution ${contributionName} not found`);
  return {
    ...config,
    repo: {
      ...repo,
      contribution,
    },
  };
}

export default config;
