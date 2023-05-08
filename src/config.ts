import { IconType } from "react-icons";
import { FaTwitter } from "react-icons/fa";

// type TailwindColor = "slate" | "gray" | "zinc" | "neutral" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
// TODO add more color options, add to tailwind.config.js, move this elsewhere
type TailwindColor = "slate" | "blue" | "red";

export type C11RContribution = {
  name: string;
  type: string;
  description?: string;
  color?: TailwindColor;
  options?: { [key: string]: any };
  icon?: IconType;
};

export type C11RRepoConfig = {
  title: string;
  name: string;
  base?: string;
  branchPrefix?: string;
  description?: string;
  contributions: C11RContribution[];
};

export type C11RRepo = C11RRepoConfig &
  Omit<C11RConfig, "repos"> & {
    githubUrl: string;
  };

export type C11RConfig = {
  owner: string;
  branchPrefix?: string;
  repos: C11RRepoConfig[];
};

const config: C11RConfig = {
  owner: "Contribunator",
  repos: [
    {
      title: "Sample Repo",
      name: "Sample", // the name of the repo
      description: "A useless and vandalized demo repository for Contribunator",
      // TODO add optional `bases` field to allow choice of which branch to merge to
      contributions: [
        {
          type: "tweet",
          name: "Tweet",
          color: "blue",
          icon: FaTwitter,
          description:
            "Submit a twitter-together formatted tweet to the sample respository, demonstrating the use of Contribunator",
        },
      ],
    },
    {
      title: "Another Sample Repo",
      name: "Another",
      description:
        "Another useless and vandalized demo repository for Contribunator",
      contributions: [
        {
          type: "tweet",
          name: "Tweet",
          color: "blue",
          icon: FaTwitter,
          description:
            "Submit a twitter-together formatted tweet to the sample respository, demonstrating the use of Contribunator. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis ultricies ultricies, nunc nisl aliquam nunc, quis ali",
        },
      ],
    },
  ],
};

// decorate the defaults and parent properties
export function getRepoConfig(repo: string): C11RRepo {
  const { repos, ...rest } = config;
  const repoConfig = repos.find((r) => r.name === repo);
  if (!repoConfig) {
    throw new Error(`Config not defined for repo: ${repo}`);
  }
  const merged = { ...rest, ...repoConfig };
  const defauls = {
    base: "main",
    branchPrefix: "c11r/",
    githubUrl: `https://github.com/${merged.owner}/${merged.name}`,
  };
  return { ...defauls, ...merged };
}

export default config;
