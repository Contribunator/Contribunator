import { IconType } from "react-icons";
import { FaTwitter } from "react-icons/fa";

// type TailwindColor = "slate" | "gray" | "zinc" | "neutral" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
// TODO add more color options, add to tailwind.config.js
type TailwindColor = "slate" | "blue" | "red";

export type C11RContribution = {
  name: string;
  type: string;
  description?: string;
  color?: TailwindColor;
  options?: { [key: string]: any };
  icon?: IconType;
};

export type C11RRepo = {
  title: string;
  name: string;
  description?: string;
  contributions: C11RContribution[];
};

export type C11RConfig = {
  owner: string;
  repos: C11RRepo[];
};

// TODO restructure using key pairs instead of array
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
      name: "Another", // the name of the repo
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

export function getRepoConfig(repo: string) {
  const { repos, ...rest } = config;
  const repoConfig = repos.find((r) => r.name === repo);
  if (!repoConfig) {
    throw new Error(`Config not defined for repo: ${repo}`);
  }
  const githubUrl = `https://github.com/${rest.owner}/${repoConfig.name}`;
  return { ...rest, ...repoConfig, githubUrl };
}

/*
const config: C11RConfig = {
  owner: "ethereumclassic",
  repos: [
    {
      name: "ETC Website",
      repo: "ethereumclassic.github.io",
      contributions: [
        {
          type: "video",
          icon: HiVideoCamera,
          name: "Video",
          options: { title: "This is a test" },
        },
        {
          type: "video",
          name: "Video with something else",
          options: { title: "Video, but with a different title" },
        },
      ],
    },
    {
      name: "@eth_classic Twitter",
      repo: "tweets-etc_network",
      contributions: [{ type: "tweet", name: "Simple Tweet" }],
    },
    {
      name: "@etc_network Twitter",
      repo: "tweets-eth_classic",
      contributions: [
        { type: "tweet", name: "Simple Tweet" },
        {
          type: "tweet",
          name: "Poll",
          description: "A poll tweet",
          options: { type: "poll" },
        },
      ],
    },
    {
      name: "Test Failed to get repo",
      repo: "not-real",
      contributions: [],
    },
  ],
};
*/
export default config;
