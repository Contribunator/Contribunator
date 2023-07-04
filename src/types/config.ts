import type {
  Contribution,
  ContributionConfig,
  ContributionOptions,
} from "./contribution";

export type AuthType = "github" | "captcha" | "api" | "anon";

export type Config = {
  title: string;
  description: string;
  authorization: AuthType[];
  owner: string;
  base?: string;
  branchPrefix: string;
  prPostfix: string;
  addLabels?: string[];
  requestReviewers?: {
    users?: string[];
    teams?: string[];
  };
  repos: { [key: string]: Repo };
};

export type Repo = Omit<Config, "repos"> & {
  name: string;
  githubUrl: string;
  contributions: { [key: string]: ContributionConfig };
};

export type UserConfig = Partial<Omit<Config, "repos">> & {
  repos?: {
    [key: string]: Partial<Omit<Repo, "contributions">> & {
      contributions: { [key: string]: ContributionConfig };
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
