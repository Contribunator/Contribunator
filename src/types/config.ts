import type { Contribution, ContributionOptions } from "./contribution";

export type AuthType = "github" | "captcha" | "api" | "anon";

type InheritedProperties = {
  owner: string;
  base: string;
  branchPrefix: string;
  prPostfix: string;
};

type CommonFields = {
  title: string;
  description: string;
};

type RepoBase = Partial<InheritedProperties> & CommonFields;

type RepoConfig = RepoBase & {
  contributions: { [key: string]: ContributionOptions };
};

export type RepoWithContributions = RepoBase & {
  githubUrl: string;
  name: string;
  contributions: { [key: string]: Contribution };
};

export type Repo = Omit<RepoWithContributions, "contributions">;

export type ConfigBase = CommonFields &
  InheritedProperties & {
    authorization: AuthType[];
    repos?: Repos;
  };

export type GetRepos = { repos: () => Repos | {} };

export type Repos = { [key: string]: RepoConfig };

export type UserConfig = Partial<ConfigBase> & GetRepos;

export type Config = ConfigBase & {
  repos: { [key: string]: RepoWithContributions };
};

export type ConfigWithRepo = Omit<Config, "repos"> & {
  repo: RepoWithContributions;
};

export type ConfigWithContribution = Omit<ConfigWithRepo, "repo"> & {
  contribution: Contribution;
  repo: Repo;
};
