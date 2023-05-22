import { IconType } from "react-icons";
import { FaTwitter, FaVideo } from "react-icons/fa";
import appConfig from "@/../contribunator.config";
import { AuthType } from "./authorize";

// type TailwindColor = "slate" | "gray" | "zinc" | "neutral" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
// TODO add more color options, add to tailwind.config.js, move this elsewhere
type TailwindColor = "slate" | "blue" | "red";

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
    contributions: Contribution[];
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

const defaultConfig: BaseConfig = {
  authorization: ["github", "captcha"],
  title: "Contribunator Demo",
  description:
    "Effortlessly contribute to GitHub! No coding or GitHub experience needed. Simply fill out a form, submit, and you're done. Contributing has never been easier!",
  owner: "Contribunator",
  branchPrefix: "c11r/",
  base: "main",
  prPostfix:
    "\n\n---\n*Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*",
  repos: {
    Sample: {
      title: "Sample Repo",
      description: "A useless and vandalized demo repository for Contribunator",
      contributions: [
        {
          type: "tweet",
          title: "Tweet",
          color: "blue",
          icon: FaTwitter,
          description:
            "Submit a twitter-together formatted tweet to the sample respository, demonstrating the use of Contribunator",
        },
      ],
    },
  },
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

export function getRepoConfig(repo: string): Repo {
  if (!config.repos[repo]) throw new Error(`Repo ${repo} not found`);
  return config.repos[repo];
}

export default config;
