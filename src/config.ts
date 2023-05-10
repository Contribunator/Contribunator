import { IconType } from "react-icons";
import { FaTwitter, FaVideo } from "react-icons/fa";
import appConfig from "@/../contribunator.config";

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
  description?: string;
};

type RepoConfig = Partial<InheritedSettings> &
  CommonFields & {
    contributions: Contribution[];
  };

type BaseConfig = CommonFields &
  InheritedSettings & {
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
  // TODO welcome text etc
  title: "Contribunator Demo",
  description: "A tool to help you contribute to open source",
  owner: "Contribunator",
  branchPrefix: "c11r/",
  base: "main",
  repos: {
    Sample: {
      title: "Sample Repo",
      // name: "Sample", // the name of the repo
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
    // Another: {
    //   title: "Another Sample Repo",
    //   description:
    //     "Another useless and vandalized demo repository for Contribunator",
    //   contributions: [
    //     {
    //       type: "video",
    //       title: "Video",
    //       color: "red",
    //       icon: FaVideo,
    //       description: "Testing",
    //     },
    //   ],
    // },
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
