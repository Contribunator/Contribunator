import { IconType } from "react-icons";
import { FaTwitter } from "react-icons/fa";
import { AuthType } from "./authorize";

// todo is there a better way to do this?
import userConfig from "@/../contribunator.config";
import testConfig from "@/../test/test.contribunator.config";

const appConfig = testConfig || userConfig;

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

// TODO replace with test config?
// Have demo config elsewhere
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
          options: {
            text: {
              placeholder: "e.g. I like turtles 🐢 #turtlepower",
              suggestions: [
                {
                  has: "(?<!\n)\n(?!\n)",
                  message: "Use double spaces to separate lines",
                },
                {
                  hasNo: "[#$]",
                  message: "Include some Hashtags",
                },
                {
                  hasNo: "\\p{Emoji_Presentation}",
                  message: "Add emojis to your tweet",
                },
              ],
              tags: ["🐢", "💪", "#tutles", "#turtlepower"],
            },
          },
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

export type ConfigWithRepo = Config & { repo: Repo };
export type ConfigWithContribution = ConfigWithRepo & {
  repo: { contribution: Contribution };
};

// returns relevant config object
export function getConfig(): Config;
export function getConfig(repo: string): ConfigWithRepo;
export function getConfig(
  repo: string,
  contribution: string
): ConfigWithContribution;
export function getConfig(
  repo?: string,
  contribution?: string
): Config | ConfigWithRepo | ConfigWithContribution {
  if (!repo) return config;
  const repoConfig = config.repos[repo];
  if (!repoConfig) throw new Error(`Repository ${repo} not found`);
  if (!contribution) return { ...config, repo: repoConfig };
  // TODO replace this with a keyValue, so the same contribution type can have different
  // will need to use dynamic paths for the form
  const contributionConfig = repoConfig.contributions.find(
    (c) => c.type === contribution
  );
  if (!contributionConfig)
    throw new Error(`Contribution ${contribution} notfound`);
  return {
    ...config,
    repo: {
      ...repoConfig,
      contribution: contributionConfig,
    },
  };
}

export default config;
