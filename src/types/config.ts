import type { Contribution } from "./contribution";

export type AuthType = "github" | "captcha" | "api" | "anon";

export type Config = {
  title: string;
  description: string;
  authorization: AuthType[];
  owner: string;
  base: string;
  branchPrefix: string;
  prPostfix: string;
  repos: { [key: string]: Repo };
};

export type Repo = Omit<Config, "repos"> & {
  name: string;
  githubUrl: string;
  contributions: { [key: string]: Contribution };
};

export type ContributionLoader = (name: string, repo: Repo) => Contribution;

export type UserConfig = Partial<Config> & {
  repos?: {
    [key: string]: Partial<Repo> & {
      contributions: { [key: string]: ContributionLoader };
    };
  };
};

export type ConfigWithRepo = Config & {
  repo: Repo;
};

export type ConfigWithContribution = Config & {
  repo: Repo;
  contribution: Contribution;
};
